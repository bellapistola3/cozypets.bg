import React from "react";

const About = () => {
  return (
    <section className="px-6 py-12 max-w-3xl mx-auto text-gray-800">
      {/* Logo at top of About page - Much Bigger */}
      <div className="text-center mb-12">
        <img 
          src="/src/components/assets/лого.png" 
          alt="CozyPets by Alice" 
          className="h-32 md:h-40 w-auto mx-auto mb-8 filter drop-shadow-lg"
        />
      </div>
      
      <h1 className="text-4xl font-bold mb-6 text-center">За нас 🐾</h1>

      <p className="text-lg mb-6">
        CozyPets by Alice е създаден с една искрена и практична цел – да улесним живота на собствениците на домашни любимци и да подкрепим хората, които искат да се грижат за тях с любов.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Нашето начало</h2>
      <p className="text-lg mb-6">
        Всичко започва с опита на Алис – като служител в уютен столичен хотел за домашни любимци. Именно там се ражда идеята, че добрата грижа може да бъде пренесена и в домашна среда. Следват участия в още два специализирани хотела за кучета, котки, папагали, гризачи, рибки и други. Натрупаният опит и страстта към животните прерастват в лична практика – предлагана в рамките на домашния уют.
      </p>

      <p className="text-lg mb-6">
        Именно тогава към идеята се присъединява втори член на екипа, и заедно с времето се оформя ясната визия – да създадем платформа, която свързва собственици и гледачи по бърз, сигурен и човешки начин.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Днес сме четирима</h2>
      <p className="text-lg mb-6">
        CozyPets вече е резултат от усилията и мечтата на четирима приятели – Алис, Мишо, Борислав и Христо. Всеки от нас допринася със своя опит, страст и желание да изградим платформа, която съчетава удобство, грижа и доверие.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Какво ни отличава?</h2>
      <ul className="list-disc list-inside text-lg space-y-2">
        <li>✔️ Проверени и оценени гледачи</li>
        <li>✔️ Сигурна и лесна система за резервации и плащания</li>
        <li>✔️ Подход, базиран на реален опит и любов към животните</li>
        <li>✔️ Платформа, създадена от хора с мисия, не просто идея</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Станете част от нашето семейство</h2>
      <p className="text-lg mb-6">
        CozyPets не е просто платформа – това е общност. Приканваме ви да бъдете част от нея – като собственик, който търси сигурна грижа за любимеца си, или като гледач, готов да подари време, обич и внимание.
      </p>

      <div className="text-center mt-10">
        <a
          href="/#contact"
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
        >
          Свържете се с нас
        </a>
      </div>
    </section>
  );
};

export default About;