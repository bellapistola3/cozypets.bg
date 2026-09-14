# Cozy Pets by Alice — Agent Set

Този набор от агенти е предназначен да помогне при стартирането, стабилното управление и предаването на платформата `cozypets.bg`.

## Как да ги използвате

- `launch` — за подготовка преди стартиране и планиране на go-live
- `deploy` — за деплой, конфигурация, домейни, env, rollback
- `ops` — за работа след стартиране: мониторинг, инциденти, runbooks
- `qa` — за регресии, тестове, приемане и качество
- `handover` — за документация, обучение и предаване на управлението

## Списък с файлове

- `.agent.launch.md` — Launch agent
- `.agent.deploy.md` — Deployment agent
- `.agent.ops.md` — Operations agent
- `.agent.qa.md` — QA agent
- `.agent.handover.md` — Handover agent

## Кога да използвате кой агент

### Launch agent
Използвайте го, когато:
- подготвяте платформата за публично пускане
- трябва да проверите readiness на frontend, backend, auth, database, env и домейни
- искате checklist за go-live и blocker list

### Deploy agent
Използвайте го, когато:
- правите деплой на frontend/backend
- конфигурирате Netlify/Firebase/Supabase
- имате нужда от rollback план или env management

### Ops agent
Използвайте го, когато:
- платформата вече е онлайн и трябва да се управлява стабилно
- искате да следите инциденти, бързи дългове, мониторинг, alerts и support workflow

### QA agent
Използвайте го, когато:
- правите регресионни проверки
- имате нужда от дневни/релизни тестове
- трябва да поставите acceptance criteria и да проверявате bugfix-и

### Handover agent
Използвайте го, когато:
- готовите платформата за предаване на нов екип или външна компания
- трябва да напишете runbooks, approvals, permissions, SOPs и документация

## Предложение за минимален екип агенти

За този проект е разумно да имате поне 5 специализирани агента, както са описани по-горе.

Ако искате, следващата стъпка е да ги разширите с още:
- content/marketing agent
- support agent
- analytics agent
- security/privacy agent
