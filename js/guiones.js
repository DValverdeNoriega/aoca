/* ============================================================
   AOCA — Guiones del Modo Demo
   Las 8 conversaciones pregrabadas. Funcionan SIN internet.
   Fuente de verdad: references/. No modificar el contenido sin
   revisar la voz de AOCA (máx. 2 oraciones, sin etiquetas, sin
   preguntas de sí/no, jamás la respuesta final).

   Cada guion sigue el mismo arco:
   contexto → una pista → el alumno intenta → corrección o
   profundización → el alumno concluye → AOCA verifica.
   El último 'reply' marca la llegada correcta (el alumno llega
   solo); AOCA cierra pidiendo que justifique.
   ============================================================ */
(function () {
  'use strict';

  var SCRIPTS = {
    // -------- Matemáticas --------
    lineales: {
      text: 'Empecemos con esta ecuación: 2x + 6 = 14. Antes de tocar nada, dime con tus palabras qué representa la x aquí.',
      eq: '2x + 6 = 14',
      replies: [
        'Bien. Para dejar la x sola, fíjate qué número está sumando en ese lado y escríbeme qué operación lo cancela.',
        'Eso es, restas 6 en ambos lados y llegas a 2x = 8; dime entre cuánto tienes que dividir para tener una sola x.',
        'Llegaste tú a x = 4. Reemplázalo en 2x + 6 y explícame por qué el resultado confirma que es correcto.'
      ],
      hints: [
        'Fíjate en el 6: está sumando, así que la operación contraria es restar. Empieza por ahí.',
        'Aplica la misma operación en los dos lados para no romper el equilibrio y anota qué te queda a la izquierda.',
        'Ya con 2x = 8, divide ambos lados entre el número que multiplica a la x y dime el resultado.'
      ],
      reformulate: 'Te lo planteo distinto: imagina una balanza donde 2x + 6 pesa igual que 14. Dime qué quitarías primero para empezar a aislar la x.'
    },
    cuadraticas: {
      text: 'Mira esta ecuación: x² − 5x + 6 = 0. Antes de resolver, dime qué la diferencia de una de primer grado.',
      eq: 'x² − 5x + 6 = 0',
      replies: [
        'Bien visto, aparece la x al cuadrado. Escríbeme dos números que multiplicados den 6 y sumados den −5.',
        'De las parejas que dan 6, quédate con la que sumada da −5 y ármame los paréntesis (x … )(x … ).',
        'Llegaste a x = 2 o x = 3. Reemplaza uno de los dos en la ecuación y explícame por qué la vuelve cero.'
      ],
      hints: [
        'Busca los factores de 6 y fíjate en el signo del −5: ambos números deben ser negativos.',
        'De las parejas que dan 6, prueba cuál sumada da −5 y descarta las demás.',
        'Con −2 y −3 arma (x − 2)(x − 3) = 0 e iguala cada paréntesis a cero para hallar las dos x.'
      ],
      reformulate: 'Dicho de otro modo: necesitas partir x² − 5x + 6 en dos paréntesis que se multiplican. Dime qué dos números buscarías para lograrlo.'
    },
    pitagoras: {
      text: 'Tienes un triángulo rectángulo con catetos de 3 y 4. Antes de calcular, dime cuál de los lados es la hipotenusa.',
      eq: 'a² + b² = c²',
      replies: [
        'Correcto, la hipotenusa está frente al ángulo recto. Escríbeme cómo queda a² + b² usando 3 y 4.',
        'Eso es, 9 + 16 = 25; dime qué operación te falta para pasar de 25 al valor del lado.',
        'Llegaste tú a 5. Explícame por qué ese 5 tiene que ser el lado más largo del triángulo.'
      ],
      hints: [
        'La hipotenusa es el lado opuesto al ángulo de 90°; ubícalo en tu dibujo antes de operar.',
        'Eleva cada cateto al cuadrado por separado, 3² y 4², y súmalos; anota el total.',
        'Ya tienes c² = 25; saca la raíz cuadrada de 25 y dime cuánto vale c.'
      ],
      reformulate: 'Te lo pongo distinto: los dos lados cortos, elevados al cuadrado y sumados, igualan al lado largo al cuadrado. Dime cuál sería el lado largo aquí.'
    },
    fracciones: {
      text: 'Quiero sumar 1/2 + 1/3. Dime por qué no puedo sumar directo los números de arriba y los de abajo tal como están.',
      eq: '1/2 + 1/3',
      replies: [
        'Exacto, los denominadores son distintos. Dime un número al que lleguen tanto el 2 como el 3.',
        'Con 6 como denominador común, convierte cada fracción a sextos y escríbeme cómo queda 1/2.',
        'Llegaste a 3/6 + 2/6 = 5/6. Explícame por qué el 6 se queda igual y no se suma.'
      ],
      hints: [
        'Necesitas un denominador común: busca el menor número que sea múltiplo de 2 y de 3 a la vez.',
        'Convierte cada fracción a sextos multiplicando arriba y abajo por lo mismo.',
        'Ya en sextos, suma solo los numeradores y deja el 6 abajo; dime el resultado.'
      ],
      reformulate: 'Míralo así: no puedes sumar pedazos de distinto tamaño hasta partirlos igual. Dime en qué tamaño caben exactas ambas fracciones.'
    },

    // -------- Historia del Perú --------
    caral: {
      text: 'Caral es una de las ciudades más antiguas de América y no se han hallado murallas ni armas allí. Dime qué te sugiere esa ausencia sobre cómo vivían.',
      eq: '',
      replies: [
        'Buena pista. Si no gastaron en defensa, dime en qué crees que invirtieron su trabajo en común y nómbrame una obra.',
        'Vas bien con las pirámides y plazas; dime qué hace falta para levantar algo tan grande entre tanta gente.',
        'Llegaste a que hubo una autoridad que organizaba sin guerra. Explícame qué dice eso sobre cómo se gobernaban.'
      ],
      hints: [
        'Piensa qué construye una sociedad cuando no teme un ataque: obras para reunirse, no para defenderse.',
        'En Caral destacan grandes montículos y plazas circulares hundidas; relaciónalos con actividades comunes.',
        'Levantar pirámides exige coordinar a mucha gente; conéctalo con una autoridad que organiza en vez de conquistar.'
      ],
      reformulate: 'Lo planteo distinto: en Caral falta lo que sobra en una ciudad en guerra. Dime qué esperarías ver en una ciudad militar que aquí no aparece.'
    },
    chavin: {
      text: 'Chavín de Huántar atraía peregrinos de lugares lejanos a su templo. Dime qué necesita tener un lugar para que gente de tan lejos viaje hasta él.',
      eq: '',
      replies: [
        'Vas bien. Los pasajes oscuros y el Lanzón buscaban impresionar; dime qué sentimiento crees que provocaban en el visitante.',
        'Eso es, asombro y temor; dime cómo esa sensación reforzaba la autoridad de los sacerdotes.',
        'Llegaste a que el culto común unía a pueblos distintos. Explícame por qué eso fue más fuerte que un ejército.'
      ],
      hints: [
        'Piensa en el poder de lo religioso: un oráculo o un dios común atrae a gente que no comparte territorio.',
        'Los espacios estrechos y el Lanzón estaban hechos para sobrecargar los sentidos; relaciónalo con la autoridad.',
        'Si muchos pueblos creen en el mismo culto comparten algo más fuerte que fronteras; conéctalo con la influencia de Chavín.'
      ],
      reformulate: 'Te lo pongo distinto: Chavín no conquistó con ejércitos sino con creencias. Dime qué ofrecía el templo para atraer a tanta gente.'
    },
    mita: {
      text: 'La mita colonial obligaba a los indígenas a trabajar por turnos en las minas. Dime en qué se parece y en qué se diferencia de un empleo con sueldo de hoy.',
      eq: '',
      replies: [
        'Buena distinción. Si el turno era forzado y mal pagado, dime a quién beneficiaba sobre todo ese sistema.',
        'Vas bien; la plata de Potosí iba a la corona y a los mineros. Dime qué ponían las comunidades a cambio.',
        'Llegaste a que las comunidades perdían gente y tierras. Explícame por qué eso marca la diferencia con un empleo de hoy.'
      ],
      hints: [
        'Fíjate en la palabra “obligaba”: el trabajador no elegía ir ni cuánto cobrar. Compáralo con elegir un empleo.',
        'Piensa quién recibía la plata extraída en Potosí y quién ponía el cuerpo en la mina.',
        'Relaciona los turnos forzados con la pérdida de gente y tierras en las comunidades; dime una consecuencia.'
      ],
      reformulate: 'Dicho de otro modo: la mita movía trabajo sin voluntad ni pago justo. Dime qué la separa de alguien que hoy firma un contrato.'
    },
    independencia: {
      text: 'El Perú proclamó su independencia en 1821, pero muchos siguieron viviendo casi igual. Dime qué crees que cambió y qué se mantuvo.',
      eq: '',
      replies: [
        'Buena observación. Si cambió quién gobernaba pero no quién tenía la tierra, dime para quién fue más real esa independencia.',
        'Vas bien; los cargos que dejó España los ocupó la élite criolla. Dime qué pasó mientras tanto con indígenas y esclavos.',
        'Llegaste a que para la mayoría cambió poco. Explícame por qué se dice que fue una independencia incompleta.'
      ],
      hints: [
        'Separa dos cosas: el gobierno político y la vida diaria de la mayoría; ¿cuál cambió de golpe y cuál no?',
        'Piensa quiénes ocuparon los cargos que dejó España y mira su origen social.',
        'La esclavitud y el tributo indígena siguieron años después de 1821; dime qué revela eso sobre el alcance del cambio.'
      ],
      reformulate: 'Míralo así: firmar una independencia no reparte de nuevo la tierra ni el poder. Dime quiénes seguían mandando y quiénes seguían abajo tras 1821.'
    }
  };

  // Mensajes fijos de AOCA
  var CLOSING   = 'Ya lo tienes. Cuéntame con tus palabras qué fue lo que te hizo llegar a la respuesta.';
  var EXHAUSTED = 'Ya no puedo darte más pistas sin resolverlo por ti. Escríbeme lo que tienes hasta ahora, aunque esté a medias.';
  var ERROR_MSG = 'No pude conectarme. Cambia a Modo Demo para continuar.';

  // Respuestas socráticas genéricas para consultas libres en Modo Demo
  // (cuando el alumno escribe sin haber elegido un tema con guion).
  var GENERIC = [
    'Buena pregunta. Para guiarte mejor, dime en tus palabras qué parte es la que más se te complica.',
    'Vamos por partes. Escríbeme el primer paso que se te ocurra, aunque no estés seguro de que esté bien.',
    'Antes de seguir, dime qué sabes ya de este tema y dónde sientes que se te traba.'
  ];

  window.AOCA_DEMO = {
    SCRIPTS: SCRIPTS,
    CLOSING: CLOSING,
    EXHAUSTED: EXHAUSTED,
    ERROR_MSG: ERROR_MSG,
    GENERIC: GENERIC
  };
})();
