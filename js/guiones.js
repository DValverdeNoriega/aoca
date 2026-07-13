/* ============================================================
   AOCA — Guiones del Modo Demo
   Las 16 conversaciones pregrabadas (Matemáticas, Historia,
   Ciencia y Tecnología, Comunicación). Funcionan SIN internet.
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
    },

    // ---- Ciencia y Tecnología ----
    fotosintesis: {
      text: 'Una planta encerrada en un cuarto oscuro, con agua y tierra, termina muriéndose. Dime qué le está faltando para poder fabricar su alimento.',
      eq: '',
      replies: [
        'Bien, apuntas a la luz. Ahora dime qué gas toma la planta del aire y qué saca de la tierra para combinarlos con esa luz.',
        'Vas bien: dióxido de carbono del aire y agua de la tierra. Explícame qué crees que produce la planta al juntarlos con la energía de la luz.',
        'Eso es: fabrica su propio alimento (glucosa) y libera oxígeno. Ahora dime con tus palabras por qué sin luz ese proceso no puede ocurrir.'
      ],
      hints: [
        'Piensa dónde crecen mejor las plantas: junto a una ventana o en un sótano. Eso te dice qué elemento necesitan.',
        'La planta no come del suelo como nosotros; toma agua por la raíz y un gas por las hojas. ¿Qué gas exhalamos nosotros que ellas aprovechan?',
        'La luz une el agua y el dióxido de carbono. Dime qué sustancia con azúcar obtiene la planta y qué gas suelta al final.'
      ],
      reformulate: 'Míralo así: la hoja es como una pequeña cocina que necesita tres ingredientes: luz, agua y un gas del aire. Dime cuál de los tres falta en el cuarto oscuro.'
    },
    celula: {
      text: 'Una célula de tu piel y una célula de una hoja se ven distintas, pero comparten varias partes. Dime qué parte crees que dirige lo que hace cualquier célula.',
      eq: '',
      replies: [
        'Bien, el núcleo. Ahora dime qué parte rodea a toda la célula y decide qué entra y qué sale de ella.',
        'Correcto, la membrana. La célula vegetal tiene además una capa rígida por fuera que la animal no tiene; dime cómo se llama y para qué serviría.',
        'Eso es: la pared celular le da rigidez a la vegetal. Ahora explícame con tus palabras por qué la célula de la hoja puede hacer fotosíntesis y la de tu piel no.'
      ],
      hints: [
        'Piensa en quién "da las órdenes", como el cerebro que guarda la información. Suele estar en el centro.',
        'Imagina un muro con una puerta: la puerta controla el paso. ¿Qué parte hace ese control en la célula?',
        'La célula vegetal tiene cloroplastos verdes y una capa dura por fuera. Dime cuál de esas dos le falta a la célula animal.'
      ],
      reformulate: 'Piensa en la célula como una casa: una dirección (núcleo), una puerta que filtra (membrana) y, en las plantas, un muro extra. Dime cuál de esas partes manda sobre las demás.'
    },
    digestivo: {
      text: 'Muerdes una manzana y minutos después ya no está en tu boca, pero tampoco desapareció por arte de magia. Dime dónde empieza a transformarse ese alimento apenas entra a tu cuerpo.',
      eq: '',
      replies: [
        'Bien, en la boca. Además de masticar, la saliva ya empieza a deshacerla; dime hacia qué órgano baja el alimento después de que tragas.',
        'Correcto: baja por el esófago hasta el estómago, donde los jugos la deshacen más. Dime en qué órgano largo y enrollado crees que se absorben los nutrientes.',
        'Eso es: en el intestino delgado los nutrientes pasan a la sangre. Ahora explícame con tus palabras por qué masticar bien al inicio ayuda a todo el resto del proceso.'
      ],
      hints: [
        'Piensa en lo primero que haces con la comida antes de tragarla. ¿Con qué la partes y la mezclas con saliva?',
        'Al tragar, la comida no salta directo al estómago: baja por un "tubo". ¿Cómo se llama ese conducto?',
        'Los nutrientes pasan a la sangre en un órgano muy largo y enrollado, después del estómago. Dime si es el intestino delgado o el grueso.'
      ],
      reformulate: 'Imagina la comida como un viaje: boca → tubo → bolsa que la deshace → tubo largo que absorbe. Dime qué órgano cumple el papel de esa "bolsa que la deshace".'
    },
    cadenas: {
      text: 'En un campo hay pasto, saltamontes que se lo comen y ranas que se comen a los saltamontes. Dime quién fabrica su propio alimento y por eso arranca la cadena.',
      eq: '',
      replies: [
        'Bien, el pasto es el productor porque hace fotosíntesis. Dime entonces cómo llamarías al saltamontes, que no fabrica su alimento sino que se lo come a otro.',
        'Correcto, es un consumidor. La rana también consume al comerse al saltamontes; dime qué les pasaría a las ranas si desaparecieran todos los saltamontes.',
        'Eso es: sin saltamontes las ranas se quedan sin alimento y disminuyen. Ahora explícame con tus palabras por qué el pasto es tan importante para toda la cadena.'
      ],
      hints: [
        'Solo uno de los tres no necesita comerse a otro: usa la luz del sol para alimentarse. ¿Cuál es?',
        'Al que fabrica su alimento lo llamamos productor; al que se lo come, consumidor. ¿En qué grupo entra el saltamontes?',
        'Piensa en una fila donde cada uno depende del anterior. Si quitas un eslabón del medio, dime qué pasa con el que venía después.'
      ],
      reformulate: 'Imagina la cadena como flechas de energía: pasto → saltamontes → rana, donde cada flecha significa "sirve de alimento a". Dime de dónde saca su energía el pasto.'
    },

    // ---- Comunicación ----
    sujeto: {
      text: 'En la oración "Las jugadoras de mi colegio ganaron el campeonato", una parte dice de quién se habla y otra dice qué hizo. Dime cuál nombra de quién estamos hablando.',
      eq: '',
      replies: [
        'Bien, "las jugadoras de mi colegio" es el sujeto. Dime ahora qué parte de la oración cuenta lo que ese sujeto hizo.',
        'Correcto, "ganaron el campeonato" es el predicado. Dentro del sujeto hay una palabra principal (el núcleo); dime cuál es la más importante de "las jugadoras de mi colegio".',
        'Eso es: el núcleo del sujeto es "jugadoras". Ahora explícame con tus palabras qué te preguntarías para encontrar el sujeto en cualquier oración.'
      ],
      hints: [
        'Pregúntate: ¿de quién o de qué se está hablando en la oración? Esa respuesta es el sujeto.',
        'Lo que dice qué ocurre o qué hace forma la otra parte de la oración. ¿Cómo se llama esa parte?',
        'El núcleo del sujeto suele ser un sustantivo. En "las jugadoras de mi colegio", dime qué palabra es el nombre principal.'
      ],
      reformulate: 'Piensa en una foto: el sujeto es "quién sale" y el predicado es "qué está haciendo". Dime quién sale en la foto de esa oración.'
    },
    tildacion: {
      text: 'Las palabras "árbol", "canción" y "médico" llevan tilde, pero por razones distintas. Para empezar, dime en qué sílaba recae la fuerza de voz cuando dices "can-ción".',
      eq: '',
      replies: [
        'Bien, la fuerza está en la última sílaba, "ción". A esas palabras las llamamos agudas; dime en qué letra termina "canción", porque eso decide la tilde.',
        'Correcto: las agudas llevan tilde si terminan en n, s o vocal, y "canción" termina en n. Ahora dime dónde recae la fuerza en "árbol" e intenta clasificarla.',
        'Eso es: "árbol" es grave (fuerza en la penúltima) y lleva tilde porque termina en "l". Ahora explícame con tus palabras la diferencia entre una palabra aguda y una grave.'
      ],
      hints: [
        'Di la palabra en voz alta y alarga la sílaba que suena más fuerte. En "canción", ¿es "can" o "ción"?',
        'Aguda = fuerza en la última sílaba, y lleva tilde si termina en n, s o vocal. ¿En qué letra termina "canción"?',
        'Si la fuerza cae en la penúltima sílaba, la palabra es grave. En "árbol" la fuerza está en "ár": dime qué tipo es.'
      ],
      reformulate: 'Olvida las reglas un momento y solo escucha: en cada palabra hay una sílaba que "golpea" más fuerte. Dime cuál golpea más en "médico".'
    },
    conectores: {
      text: 'Tenemos dos ideas: "Estudié toda la semana" y "aprobé el examen". Dime qué palabra pondrías en medio para mostrar que la segunda es consecuencia de la primera.',
      eq: '',
      replies: [
        'Bien, "por eso" (o "por lo tanto") muestra consecuencia. Ahora imagina lo contrario: "Estudié toda la semana ___ desaprobé"; dime qué conector marcaría esa oposición.',
        'Correcto, "pero" o "sin embargo" marcan oposición. Dime entonces qué conector usarías para solo sumar dos ideas: "Estudié ___ hice los ejercicios".',
        'Eso es: "y" (o "además") suma ideas. Ahora explícame con tus palabras para qué sirven los conectores dentro de un texto.'
      ],
      hints: [
        'Piensa en la relación: la primera idea es la causa y la segunda, el resultado. ¿Qué palabras señalan un resultado?',
        'Ahora las dos ideas se contradicen. Busca una palabra que avise "espera, viene lo contrario".',
        'Para unir dos ideas que van en el mismo sentido, sin oponerlas, usamos el conector más simple del español. ¿Cuál es?'
      ],
      reformulate: 'Piensa en los conectores como señales de tránsito entre ideas: unas dicen "por lo tanto", otras "pero", otras "y". Dime qué señal necesita el paso de "estudié" a "aprobé".'
    },
    clases: {
      text: 'En la frase "el perro negro corre rápido", cada palabra cumple un papel distinto. Dime qué palabra nombra al ser del que hablamos, es decir, el sustantivo.',
      eq: '',
      replies: [
        'Bien, "perro" es el sustantivo. Dime ahora qué palabra describe cómo es ese perro, o sea, la que funciona como adjetivo.',
        'Correcto, "negro" es adjetivo porque lo describe. Dime qué palabra expresa la acción que realiza el perro.',
        'Eso es: "corre" es el verbo, la acción. Ahora explícame con tus palabras en qué se diferencia un sustantivo de un adjetivo.'
      ],
      hints: [
        'El sustantivo es un nombre: de una persona, animal o cosa. En esa frase, ¿qué palabra nombra a un animal?',
        'El adjetivo acompaña al sustantivo y dice cómo es. Si el perro es "___", esa palabra que llena el espacio es el adjetivo.',
        'El verbo indica lo que se hace o lo que pasa. Di la frase y busca la palabra que expresa una acción.'
      ],
      reformulate: 'Piensa en cada palabra como un trabajador con un oficio: uno nombra (sustantivo), otro describe (adjetivo), otro actúa (verbo). Dime cuál de "perro", "negro" o "corre" solo nombra.'
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
