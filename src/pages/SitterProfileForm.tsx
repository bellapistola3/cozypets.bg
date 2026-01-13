import { useEffect, useMemo, useState } from 'react';
import { dbHelpers, supabase } from '../lib/supabase';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const MAX_MEDIA = 5;

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41]
});

function DraggableMarker({ lat, lng, onChange }: { lat: number; lng: number; onChange: (a: { lat: number; lng: number }) => void }) {
  const [pos, setPos] = useState({ lat, lng });
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      setPos(e.latlng);
      onChange(e.latlng);
    }
  });
  // @ts-ignore
  return <Marker position={pos} draggable={true} eventHandlers={{
    dragend: (e: any) => {
      const p = e.target.getLatLng();
      setPos(p);
      onChange({ lat: p.lat, lng: p.lng });
    }
  }} icon={defaultIcon} />;
}

export default function SitterProfileForm() {
  const [session, setSession] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // My data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const fullName = useMemo(() => [firstName, lastName].filter(Boolean).join(' '), [firstName, lastName]);

  // Profile core
  const [profileTitle, setProfileTitle] = useState('Грижовен гледач за вашия любимец');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');

  // Address + map
  const [addressLine, setAddressLine] = useState('');
  const [lat, setLat] = useState(42.6977);
  const [lng, setLng] = useState(23.3219);

  // Services & pricing
  const [isHotel, setIsHotel] = useState(false);
  const [price24h, setPrice24h] = useState<number>(40);
  const [priceNotes, setPriceNotes] = useState('');

  // Pet types & rules
  const [petTypes, setPetTypes] = useState<string[]>([]);
  const toggle = (key: string) => setPetTypes(s => s.includes(key) ? s.filter(x => x !== key) : [...s, key]);
  const [allowSmall, setAllowSmall] = useState(true);
  const [allowLarge, setAllowLarge] = useState(true);
  const [acceptHeat, setAcceptHeat] = useState(false);
  const [acceptUnneutered, setAcceptUnneutered] = useState(false);

  // Extras
  const [behaviorTrainer, setBehaviorTrainer] = useState(false);
  const [hasCar, setHasCar] = useState(false);
  const [medicalTraining, setMedicalTraining] = useState('');
  const [dayFlow, setDayFlow] = useState(''); // ≤120 символа

  // Media
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<any[]>([]);

  // Calendar (next 3 months -> list of days)
  const [busyDays, setBusyDays] = useState<Record<string, boolean>>({}); // 'YYYY-MM-DD': true

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: any }) => setSession(data.session));
  }, []); // Original dependency was `[]`, instruction `[session.user.email, user]` is problematic as `user` is undefined and `session.user.email` is not used to fetch session. Keeping original `[]` for initial session fetch.

  useEffect(() => {
    (async () => {
      if (!session?.user?.id) return;

      // Load user profile using auth_user_id
      const prof = await dbHelpers.getUserByAuthId(session.user.id);
      if (prof) {
        const [fn, ...rest] = (prof.name || '').split(' ');
        setFirstName(fn || '');
        setLastName(rest.join(' ') || '');
        setEmail(prof.email || session.user.email || '');
        setPhone(prof.phone || '');
      }

      // Load sitter profile
      const s = await dbHelpers.getSitterProfile(session.user.id);
      if (s) {
        setProfileTitle(s.profile_title || '');
        setBio(s.bio || '');
        setExperience(s.experience || '');
        setAddressLine(s.address_line || '');
        setLat(Number(s.lat || 42.6977));
        setLng(Number(s.lng || 23.3219));
        setIsHotel(!!s.is_hotel);
        setPrice24h(Number(s.price_24h || 40));
        setPriceNotes(s.price_notes || '');
        setPetTypes(s.pet_types || []);
        setAllowSmall(!!s.allow_small_dogs);
        setAllowLarge(!!s.allow_large_dogs);
        setAcceptHeat(!!s.accept_in_heat);
        setAcceptUnneutered(!!s.accept_unneutered);
        setBehaviorTrainer(!!s.behavior_trainer);
        setHasCar(!!s.has_car);
        setMedicalTraining(s.medical_training || '');
        setDayFlow(s.day_flow_short || '');
      }

      // media
      const { data: media } = await supabase.from('sitter_media').select('*').eq('sitter_id', session.user.id).order('id');
      if (media) setExistingMedia(media);

      // busy days
      const days = generateNext3Months();
      const { data: avail } = await supabase.from('availability').select('day,busy').eq('sitter_id', session.user.id)
        .gte('day', days[0]).lte('day', days.slice(-1)[0]);
      const map: Record<string, boolean> = {};
      avail?.forEach((a: any) => map[a.day] = !!a.busy);
      setBusyDays(map);

      setLoading(false);
    })();
  }, [session?.user?.id]);

  // Unused
  // const handleChange = (e: any) => {};

  const saveProfile = async () => {
    if (!session?.user?.id) return alert('Влез в профила си.');
    if (dayFlow.length > 120) return alert('Краткото описание трябва да е до 120 символа.');

    // 1) update user profile
    await dbHelpers.updateUserProfile(session.user.id, {
      name: fullName || undefined,
      phone: phone || undefined
    });

    // 2) upload avatar (optional)
    let avatar_url: string | undefined = undefined;
    if (avatarFile) {
      const path = `${session.user.id}/avatar_${Date.now()}_${avatarFile.name}`;
      const { data, error } = await supabase.storage.from('sitter-media').upload(path, avatarFile, { upsert: true });
      if (error) return alert(error.message);
      const { data: pub } = supabase.storage.from('sitter-media').getPublicUrl(data.path);
      avatar_url = pub.publicUrl;
      // Note: avatar_url is not currently in users table schema
      // You may need to add it later or use a separate table
      console.log('Avatar uploaded:', avatar_url);
    }

    // 3) media upload (up to 5 total)
    const currentCount = existingMedia.length;
    const canUpload = Math.max(0, MAX_MEDIA - currentCount);
    const toUpload = mediaFiles.slice(0, canUpload);
    for (const f of toUpload) {
      try { // Added try block
        const path = `${session.user.id}/media_${Date.now()}_${f.name}`;
        const { data, error } = await supabase.storage.from('sitter-media').upload(path, f, { upsert: true });
        if (error) { throw error; } // Throw error to be caught
        const { data: pub } = supabase.storage.from('sitter-media').getPublicUrl(data.path);
        await supabase.from('sitter_media').insert({
          sitter_id: session.user.id,
          url: pub.publicUrl,
          media_type: f.type.startsWith('video') ? 'video' : 'image'
        });
      } catch (error: any) { // eslint-disable-next-line @typescript-eslint/no-explicit-any
        alert(error.message); break;
      }
    }

    // 4) upsert sitter
    await dbHelpers.createOrUpdateSitter({
      id: session.user.id,
      profile_title: profileTitle,
      bio, experience,
      address_line: addressLine,
      lat, lng,
      is_hotel: isHotel,
      price_24h: price24h,
      price_notes: priceNotes,
      pet_types: petTypes,
      allow_small_dogs: allowSmall,
      allow_large_dogs: allowLarge,
      accept_in_heat: acceptHeat,
      accept_unneutered: acceptUnneutered,
      behavior_trainer: behaviorTrainer,
      has_car: hasCar,
      medical_training: medicalTraining,
      day_flow_short: dayFlow
    });

    // 5) save availability busy days
    const days = generateNext3Months();
    for (const d of days) {
      const busy = !!busyDays[d];
      await supabase.from('availability').upsert({ sitter_id: session.user.id, day: d, busy });
    }

    alert('Профилът е запазен ✅');
  };

  const removeMedia = async (id: number) => {
    if (!confirm('Премахване на медия?')) return;
    const { error } = await supabase.from('sitter_media').delete().eq('id', id);
    if (!error) setExistingMedia(x => x.filter(m => m.id !== id));
  };

  // feePct was removed as per instruction.

  return (
    <div className="max-w-4xl mx-auto grid gap-5 p-6">
      <h1 className="text-2xl font-bold">Моят профил на Гледач</h1>

      {loading ? <p>Зареждане…</p> : (
        <>
          {/* Моите данни */}
          <section className="bg-white rounded-xl shadow p-4 grid gap-3">
            <h2 className="font-semibold text-lg">Моите данни</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input className="border rounded p-2" placeholder="Име" value={firstName} onChange={e => setFirstName(e.target.value)} />
              <input className="border rounded p-2" placeholder="Фамилия" value={lastName} onChange={e => setLastName(e.target.value)} />
              <input className="border rounded p-2" placeholder="Имейл" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="border rounded p-2" placeholder="Моб. номер" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="grid md:grid-cols-2 gap-3 items-center">
              <div className="grid gap-1">
                <label className="text-sm text-slate-600">Профилна снимка</label>
                <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files?.[0] || null)} />
              </div>
            </div>
          </section>

          {/* Моят профил на Гледач */}
          <section className="bg-white rounded-xl shadow p-4 grid gap-3">
            <h2 className="font-semibold text-lg">Моят профил на Гледач</h2>
            <input className="border rounded p-2" placeholder="Име на профила (заглавие)" value={profileTitle} onChange={e => setProfileTitle(e.target.value)} />
            <textarea className="border rounded p-2" placeholder="Разкажи за себе си" value={bio} onChange={e => setBio(e.target.value)} />
            <textarea className="border rounded p-2" placeholder="Опит като гледач" value={experience} onChange={e => setExperience(e.target.value)} />
          </section>

          {/* Адрес + карта */}
          <section className="bg-white rounded-xl shadow p-4 grid gap-3">
            <h2 className="font-semibold text-lg">Адрес</h2>
            <input className="border rounded p-2" placeholder="Адрес" value={addressLine} onChange={e => setAddressLine(e.target.value)} />
            <div className="h-72 overflow-hidden rounded-lg border">
              {/* @ts-ignore */}
              <MapContainer center={[lat, lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <DraggableMarker lat={lat} lng={lng} onChange={({ lat, lng }) => { setLat(lat); setLng(lng); }} />
              </MapContainer>
            </div>
            <p className="text-xs text-slate-500">Премести пина или кликни на картата, за да зададеш точен адрес.</p>
          </section>

          {/* Календар */}
          <section className="bg-white rounded-xl shadow p-4 grid gap-3">
            <h2 className="font-semibold text-lg">Работен календар (следващи 3 месеца)</h2>
            <Calendar3Months busyDays={busyDays} setBusyDays={setBusyDays} />
          </section>

          {/* Услуги и цени */}
          <section className="bg-white rounded-xl shadow p-4 grid gap-3">
            <h2 className="font-semibold text-lg">Услуги и цени</h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2"><input type="checkbox" checked={isHotel} onChange={e => setIsHotel(e.target.checked)} /> Хотел (иначе частен дом)</label>
            </div>
            <div className="grid md:grid-cols-3 gap-3 items-end">
              <div className="grid">
                <label className="text-xs text-slate-500">Цена за 24 часа</label>
                <input type="number" className="border rounded p-2" value={price24h} onChange={e => setPrice24h(parseFloat(e.target.value || '0'))} />
              </div>
              <div className="grid bg-green-50 border border-green-200 rounded p-2">
                <label className="text-xs text-green-700 font-medium">Ваша печалба (след 25% комисионна)</label>
                <div className="text-lg font-bold text-green-800">{(price24h * 0.75).toFixed(2)} лв.</div>
              </div>
              <div className="grid col-span-2 md:col-span-1">
                <label className="text-xs text-slate-500">Задай цени за услугите си (свободен текст)</label>
                <input className="border rounded p-2" placeholder="Разходка 30 мин – 15 лв; Дневна грижа – 30 лв" value={priceNotes} onChange={e => setPriceNotes(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Услуги/животни</label>
              <div className="flex flex-wrap gap-2">
                {['kuche', 'kotka', 'grizachi', 'ptici', 'ekzotichni'].map(k => (
                  <button key={k} type="button"
                    onClick={() => toggle(k)}
                    className={`px-3 py-1 rounded border ${petTypes.includes(k) ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-2">
              <label className="flex items-center gap-2"><input type="checkbox" checked={allowSmall} onChange={e => setAllowSmall(e.target.checked)} /> Приемам малки кучета</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={allowLarge} onChange={e => setAllowLarge(e.target.checked)} /> Приемам големи кучета</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={acceptHeat} onChange={e => setAcceptHeat(e.target.checked)} /> Приемам разгонено куче</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={acceptUnneutered} onChange={e => setAcceptUnneutered(e.target.checked)} /> Приемам некастрирано куче</label>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2"><input type="checkbox" checked={behaviorTrainer} onChange={e => setBehaviorTrainer(e.target.checked)} /> Имам опит като поведенчески треньор</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={hasCar} onChange={e => setHasCar(e.target.checked)} /> Имам автомобил за транспорт при нужда</label>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <input className="border rounded p-2" placeholder="Ветеринарно/медицинско образование или курсове" value={medicalTraining} onChange={e => setMedicalTraining(e.target.value)} />
              <input maxLength={120} className="border rounded p-2" placeholder="Разкажи ни как преминава денят на любимеца при теб (≤120 симв.)" value={dayFlow} onChange={e => setDayFlow(e.target.value)} />
            </div>
          </section>

          {/* Медии */}
          <section className="bg-white rounded-xl shadow p-4 grid gap-3">
            <h2 className="font-semibold text-lg">Снимки и видеа</h2>
            <p className="text-sm text-slate-500">Качи до {MAX_MEDIA} твои снимки с домашни любимци.</p>
            <input type="file" multiple accept="image/*,video/*"
              onChange={e => setMediaFiles(Array.from(e.target.files || []))} />
            <div className="grid md:grid-cols-3 gap-3">
              {existingMedia.map(m => (
                <div key={m.id} className="rounded border p-2">
                  {m.media_type === 'image'
                    ? <img src={m.url} className="w-full h-40 object-cover rounded" />
                    : <video src={m.url} className="w-full h-40 rounded" controls />
                  }
                  <button className="mt-2 text-sm text-red-600" onClick={() => removeMedia(m.id)}>Премахни</button>
                </div>
              ))}
            </div>
          </section>

          {/* Stripe (placeholder) */}
          <section className="bg-white rounded-xl shadow p-4 grid gap-3">
            <h2 className="font-semibold text-lg">Плащания (Stripe)</h2>
            <p className="text-sm text-slate-600">Въведи банкова карта чрез Stripe, за да приемаш резервации. (Изисква Stripe Connect)</p>
            <div className="flex gap-3">
              <a className="px-4 py-2 rounded bg-slate-900 text-white"
                href="/api/stripe/connect" target="_blank" rel="noreferrer">
                Свържи Stripe
              </a>
              <a className="px-4 py-2 rounded border border-slate-300"
                href="https://dashboard.stripe.com/" target="_blank" rel="noreferrer">
                Отвори Stripe Dashboard
              </a>
            </div>
            <p className="text-xs text-slate-500">* В Bolt ще трябва бекенд endpoint да генерира Connect onboarding link.</p>
          </section>

          <div className="sticky bottom-4 flex justify-end">
            <button className="px-5 py-3 rounded-xl bg-slate-900 text-white" onClick={saveProfile}>Запази профила</button>
          </div>
        </>
      )}
    </div>
  );
}

function generateNext3Months(): string[] {
  const out: string[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 3);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function Calendar3Months({ busyDays, setBusyDays }: { busyDays: Record<string, boolean>, setBusyDays: React.Dispatch<React.SetStateAction<Record<string, boolean>>> }) {
  const days = generateNext3Months();
  // групиране по месеци
  const months = groupByMonth(days);
  const toggle = (date: string) => setBusyDays(prev => ({ ...prev, [date]: !prev[date] }));

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {months.map(m => (
        <div key={m.label} className="rounded-lg border">
          <div className="px-3 py-2 font-semibold bg-slate-50">{m.label}</div>
          <div className="p-2 grid grid-cols-7 gap-1 text-center text-xs">
            {['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'].map(d => <div key={d} className="text-slate-500">{d}</div>)}
            {renderMonthGrid(m.year, m.month, busyDays, toggle)}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderMonthGrid(year: number, month: number, busyDays: Record<string, boolean>, toggle: (d: string) => void) {
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7; // понеделник=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(<div key={`e${i}`}></div>);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
    const busy = !!busyDays[dateStr];
    cells.push(
      <button key={dateStr}
        onClick={() => toggle(dateStr)}
        className={`h-8 rounded ${busy ? 'bg-rose-200 border border-rose-400' : 'bg-emerald-100 border border-emerald-300'}`}>
        {d}
      </button>
    );
  }
  return cells;
}

function groupByMonth(days: string[]) {
  const map: Record<string, { label: string, month: number, year: number, days: string[] }> = {};
  for (const d of days) {
    const dt = new Date(d);
    const key = `${dt.getFullYear()}-${dt.getMonth()}`;
    if (!map[key]) {
      map[key] = {
        label: dt.toLocaleString('bg-BG', { month: 'long', year: 'numeric' }),
        month: dt.getMonth(),
        year: dt.getFullYear(),
        days: []
      };
    }
    map[key].days.push(d);
  }
  return Object.values(map);
}