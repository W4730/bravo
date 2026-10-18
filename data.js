// Catálogo de la demo. Juegos y estudios reales; precios, descuentos y requisitos son ilustrativos.
// scheme = color de la portada: m mostaza, b ladrillo, t verde azulado, k tinta, c crema.
// cover = cortes de línea del título en la portada ("|").

const STUDIOS = {
  'cordero-valbuena': { name: 'Julián Cordero y Sebastián Valbuena', place: 'Quito', country: 'Ecuador', bio: 'Dúo creador de Despelote, una memoria jugable sobre crecer en Quito durante la eliminatoria al Mundial de 2002. Publicado por Panic.' },
  ironhide: { name: 'Ironhide Game Studio', place: 'Montevideo', country: 'Uruguay', bio: 'Estudio uruguayo creador de la saga Kingdom Rush e Iron Marines, referentes mundiales del tower defense.' },
  'long-hat-house': { name: 'Long Hat House', place: 'Belo Horizonte', country: 'Brasil', bio: 'Estudio brasileño detrás de Dandara, inspirado en una heroína de la historia afrobrasileña.' },
  lienzo: { name: 'Lienzo', place: 'Chihuahua', country: 'México', bio: 'Estudio mexicano que convierte culturas y mitos de México en juegos de acción: Mulaka y Aztech Forgotten Gods.' },
  'pixel-punk': { name: 'Studio Pixel Punk', place: '', country: 'Brasil', bio: 'Estudio independiente brasileño creador de Unsighted.' },
  behold: { name: 'Behold Studios', place: 'Brasília', country: 'Brasil', bio: 'Estudio brasileño de Chroma Squad y Knights of Pen & Paper.' },
  aquiris: { name: 'Aquiris', place: 'Porto Alegre', country: 'Brasil', bio: 'Estudio brasileño de Horizon Chase, homenaje a las carreras arcade clásicas.' },
  leap: { name: 'LEAP Game Studios', place: 'Lima', country: 'Perú', bio: 'Estudio peruano que llevó el folclore amazónico al beat \'em up con Tunche.' },
  halberd: { name: 'Halberd Studios', place: 'Guadalajara', country: 'México', bio: 'Estudio mexicano de 9 Years of Shadows, financiado por su comunidad en Kickstarter.' },
  hammer95: { name: 'HAMMER95', place: '', country: 'Brasil', bio: 'Estudio brasileño de shooters retro con humor ochentero.' },
  'ace-team': { name: 'ACE Team', place: 'Santiago', country: 'Chile', bio: 'Estudio chileno de mundos surrealistas: Zeno Clash, Rock of Ages y The Eternal Cylinder.' },
  'coffee-powered': { name: 'Coffee Powered Machine', place: '', country: 'Argentina', bio: 'Estudio argentino creador de Okhlos, publicado por Devolver Digital.' },
  'rogue-snail': { name: 'Rogue Snail', place: '', country: 'Brasil', bio: 'Estudio brasileño de Relic Hunters y Hell Clock.' },
  'team-cherry': { name: 'Team Cherry', place: 'Adelaida', country: 'Australia', latam: false, bio: 'Pequeño estudio australiano creador de Hollow Knight.' },
  concernedape: { name: 'ConcernedApe', place: '', country: 'Estados Unidos', latam: false, bio: 'Eric Barone, creador en solitario de Stardew Valley.' },
  maddy: { name: 'Maddy Makes Games', place: 'Vancouver', country: 'Canadá', latam: false, bio: 'Estudio canadiense creador de Celeste.' },
  supergiant: { name: 'Supergiant Games', place: 'San Francisco', country: 'Estados Unidos', latam: false, bio: 'Estudio independiente de Bastion, Transistor y Hades.' },
};

const GAMES = [
  { id: 'despelote', title: 'Despelote', studio: 'cordero-valbuena', year: 2025, genres: ['Narrativo', 'Aventura'], price: 12.99, off: 0, tier: 'medio', scheme: 'm',
    blurb: 'Quito, 2001: Ecuador está a un paso de su primer Mundial y Julián, de ocho años, solo piensa en fútbol.',
    about: 'Una memoria jugable en primera persona sobre la infancia, el barrio y la pelota. Patea, recorre parques y calles de Quito y escucha a la gente mientras el país entero sigue la eliminatoria.' },
  { id: 'kingdom-rush', title: 'Kingdom Rush', cover: 'Kingdom|Rush', studio: 'ironhide', year: 2014, genres: ['Estrategia'], price: 9.99, off: 60, tier: 'ligero', scheme: 't',
    blurb: 'Defiende el reino con torres de arqueros, magos, artillería y barracas.',
    about: 'Coloca y mejora torres a lo largo del camino, llama refuerzos y usa hechizos para frenar oleadas de orcos, trolls y criaturas oscuras. El clásico con el que Ironhide se volvió referente del género.' },
  { id: 'kingdom-rush-alliance', title: 'Kingdom Rush 5: Alliance TD', cover: 'Kingdom|Rush 5|Alliance', studio: 'ironhide', year: 2024, genres: ['Estrategia'], price: 19.99, off: 25, tier: 'medio', scheme: 'b',
    blurb: 'Héroes del reino y del ejército oscuro unen fuerzas contra una amenaza común.',
    about: 'La quinta entrega de la saga reúne héroes de ambos bandos, nuevas torres y campañas para defender Linirea.' },
  { id: 'dandara', title: 'Dandara', studio: 'long-hat-house', year: 2018, genres: ['Metroidvania', 'Acción'], price: 14.99, off: 50, tier: 'ligero', scheme: 'k',
    blurb: 'Desafía la gravedad saltando entre suelos, paredes y techos en un mundo al borde del colapso.',
    about: 'Un metroidvania inspirado en Dandara dos Palmares, heroína afrobrasileña que luchó contra la esclavitud. Explora el mundo de Sal, salta de superficie en superficie y libera a su pueblo de la opresión.' },
  { id: 'mulaka', title: 'Mulaka', studio: 'lienzo', year: 2018, genres: ['Aventura', 'Acción'], price: 19.99, off: 70, tier: 'medio', scheme: 'c',
    blurb: 'Acción y aventura en la Sierra Tarahumara, inspirada en la cultura rarámuri.',
    about: 'Encarna a un chamán rarámuri que se transforma en animales y enfrenta criaturas de la mitología tarahumara para salvar su mundo. Desarrollado en Chihuahua con asesoría de antropólogos.' },
  { id: 'aztech', title: 'Aztech Forgotten Gods', cover: 'Aztech|Forgotten|Gods', studio: 'lienzo', year: 2022, genres: ['Acción', 'Aventura'], price: 24.99, off: 40, tier: 'exigente', scheme: 't',
    blurb: 'En una Tenochtitlan de alta tecnología, Achtli enfrenta a dioses colosales con un guantelete ancestral.',
    about: 'Acción y aventura en 3D que imagina una Mesoamérica futurista. Vuela por la ciudad con un brazo de tecnología ancestral y derriba gigantes en combates a gran escala.' },
  { id: 'unsighted', title: 'Unsighted', studio: 'pixel-punk', year: 2021, genres: ['RPG', 'Metroidvania'], price: 19.99, off: 35, tier: 'ligero', scheme: 'b',
    blurb: 'Un action RPG contra el reloj: cada autómata tiene tiempo contado antes de perder la conciencia.',
    about: 'Explora Arcadia como Alma, una autómata que busca salvar a sus amigos mientras se agota el polvo de meteoro que los mantiene vivos. Decide a quién ayudar con el poco tiempo que queda.' },
  { id: 'chroma-squad', title: 'Chroma Squad', cover: 'Chroma|Squad', studio: 'behold', year: 2015, genres: ['Estrategia', 'RPG'], price: 14.99, off: 75, tier: 'ligero', scheme: 'm',
    blurb: 'Dirige tu propio programa de superhéroes al estilo sentai.',
    about: 'Cinco dobles de acción renuncian y abren su propio estudio de televisión. Combates tácticos por turnos, utilería hecha a mano, actores y una audiencia que hay que conquistar episodio a episodio.' },
  { id: 'horizon-chase-turbo', title: 'Horizon Chase Turbo', cover: 'Horizon|Chase|Turbo', studio: 'aquiris', year: 2018, genres: ['Carreras'], price: 19.99, off: 60, tier: 'medio', scheme: 'k',
    blurb: 'Carreras arcade inspiradas en los clásicos de los 80 y 90.',
    about: 'Recorre circuitos de todo el mundo con autos de colores vivos, banda sonora de Barry Leitch y multijugador local en pantalla dividida.' },
  { id: 'tunche', title: 'Tunche', studio: 'leap', year: 2021, genres: ['Acción', 'Roguelike'], price: 19.99, off: 50, tier: 'medio', scheme: 't',
    blurb: 'Beat \'em up con elementos roguelite ambientado en la Amazonía peruana.',
    about: 'Elige entre personajes como Rumi, la chamana, y enfréntate al Tunche, espíritu del folclore amazónico, en peleas dibujadas a mano.' },
  { id: '9-years-of-shadows', title: '9 Years of Shadows', cover: '9 Years|of|Shadows', studio: 'halberd', year: 2023, genres: ['Metroidvania', 'Acción'], price: 19.99, off: 30, tier: 'ligero', scheme: 'c',
    blurb: 'Metroidvania en pixel art: Europa explora Talos, un castillo maldito, para devolverle el color al mundo.',
    about: 'Combina armaduras con poderes elementales y combates exigentes junto a un compañero inesperado. Creado en Guadalajara y financiado por la comunidad en Kickstarter.' },
  { id: 'mullet-mad-jack', title: 'Mullet Mad Jack', cover: 'Mullet|Mad Jack', studio: 'hammer95', year: 2024, genres: ['Shooter', 'Acción'], price: 13.99, off: 20, tier: 'medio', scheme: 'b',
    blurb: 'Shooter retro ochentero: cada enemigo derrotado te regala segundos de vida.',
    about: 'Tienes 10 segundos para seguir eliminando robots millonarios y mantener tu dopamina. Velocidad, humor de anime de los 80 y pisos que se generan uno tras otro.' },
  { id: 'rock-of-ages', title: 'Rock of Ages', cover: 'Rock|of Ages', studio: 'ace-team', year: 2011, genres: ['Estrategia', 'Acción'], price: 9.99, off: 80, tier: 'medio', scheme: 'm',
    blurb: 'Lanza una roca gigante a través de la historia del arte para derribar el castillo enemigo.',
    about: 'Estrategia y caos: construye defensas mientras tu roca rueda cuesta abajo hacia la puerta rival. Humor absurdo con estética de grabados y pinturas clásicas.' },
  { id: 'eternal-cylinder', title: 'The Eternal Cylinder', cover: 'The|Eternal|Cylinder', studio: 'ace-team', year: 2021, genres: ['Supervivencia', 'Aventura'], price: 29.99, off: 50, tier: 'exigente', scheme: 'k',
    blurb: 'Guía a los Trebhum mientras un cilindro colosal arrasa con todo a su paso.',
    about: 'Supervivencia surrealista: tus criaturas mutan al comer y adquieren nuevas habilidades para escapar del cilindro y descubrir su origen.' },
  { id: 'okhlos', title: 'Okhlos', studio: 'coffee-powered', year: 2016, genres: ['Roguelike', 'Acción'], price: 14.99, off: 60, tier: 'ligero', scheme: 'c',
    blurb: 'Arma una turba de ciudadanos y filósofos furiosos para derrocar a los dioses del Olimpo.',
    about: 'Acción roguelite en pixel art: recluta a la multitud, crece en número y lánzala contra guardias, héroes y dioses en ciudades generadas proceduralmente.' },
  { id: 'hell-clock', title: 'Hell Clock', cover: 'Hell|Clock', studio: 'rogue-snail', year: 2025, genres: ['Roguelike', 'Acción'], price: 19.99, off: 10, tier: 'medio', scheme: 'b',
    blurb: 'Roguelike de acción contra el reloj inspirado en la Guerra de Canudos, en el sertão brasileño.',
    about: 'Como Pajeú, desciende al infierno para liberar el alma de su mentor. Cada incursión tiene tiempo limitado y cada muerte te vuelve más fuerte.' },
  { id: 'hollow-knight', title: 'Hollow Knight', cover: 'Hollow|Knight', studio: 'team-cherry', year: 2017, genres: ['Metroidvania', 'Acción'], price: 14.99, off: 50, tier: 'ligero', scheme: 'k',
    blurb: 'Explora Hallownest, un antiguo reino de insectos en ruinas.',
    about: 'Metroidvania de acción dibujado a mano, con combate preciso, decenas de jefes y un mundo enorme por descubrir.' },
  { id: 'stardew-valley', title: 'Stardew Valley', cover: 'Stardew|Valley', studio: 'concernedape', year: 2016, genres: ['Simulación', 'RPG'], price: 14.99, off: 0, tier: 'ligero', scheme: 'm',
    blurb: 'Hereda la vieja granja de tu abuelo y empieza una nueva vida en el valle.',
    about: 'Cultiva, cría animales, pesca, explora minas y conoce al pueblo. Juega en solitario o en cooperativo.' },
  { id: 'celeste', title: 'Celeste', studio: 'maddy', year: 2018, genres: ['Plataformas'], price: 19.99, off: 75, tier: 'ligero', scheme: 'c',
    blurb: 'Ayuda a Madeline a llegar a la cima de la montaña Celeste.',
    about: 'Plataformas preciso y exigente sobre la ansiedad y el autoconocimiento, con más de 700 pantallas y un modo de asistencia.' },
  { id: 'hades', title: 'Hades', studio: 'supergiant', year: 2020, genres: ['Roguelike', 'Acción'], price: 24.99, off: 40, tier: 'medio', scheme: 't',
    blurb: 'Escapa del inframundo como Zagreo, hijo de Hades.',
    about: 'Roguelike de acción con armas legendarias, bendiciones de los dioses del Olimpo y una historia que avanza con cada intento.' },
];

const REQ_LABELS = ['Sistema', 'Procesador', 'Memoria', 'Gráficos', 'Espacio'];
const REQS = {
  ligero: {
    min: ['Windows 10 de 64 bits', 'Intel Core i3 o AMD Athlon', '4 GB de RAM', 'Intel HD 4000 o equivalente', '2 GB'],
    rec: ['Windows 10 u 11', 'Intel Core i5 o AMD Ryzen 3', '8 GB de RAM', 'GeForce GTX 750 o equivalente', '2 GB en SSD'],
  },
  medio: {
    min: ['Windows 10 de 64 bits', 'Intel Core i5-4460 o Ryzen 3 1200', '8 GB de RAM', 'GeForce GTX 960 o Radeon RX 470', '15 GB'],
    rec: ['Windows 10 u 11', 'Intel Core i5-8400 o Ryzen 5 2600', '16 GB de RAM', 'GeForce GTX 1060 o Radeon RX 580', '15 GB en SSD'],
  },
  exigente: {
    min: ['Windows 10 de 64 bits', 'Intel Core i5-6600 o Ryzen 5 1600', '8 GB de RAM', 'GeForce GTX 1050 Ti o Radeon RX 570', '30 GB'],
    rec: ['Windows 11', 'Intel Core i7-8700 o Ryzen 7 3700X', '16 GB de RAM', 'GeForce RTX 2060 o Radeon RX 6600', '30 GB en SSD'],
  },
};

const PAY = [
  { id: 'tarjeta', name: 'Tarjeta de crédito o débito', desc: 'Visa o Mastercard emitidas en tu país. Pagas en la pasarela segura del proveedor.' },
  { id: 'billetera', name: 'Billetera digital', desc: 'Paga desde la app de tu banco o tu billetera con un código QR.' },
  { id: 'transferencia', name: 'Transferencia bancaria', desc: 'Recibes los datos de la cuenta y tu juego se habilita al confirmar el pago.' },
  { id: 'efectivo', name: 'Efectivo en puntos de pago', desc: 'Generas un código y pagas en tiendas o agencias autorizadas. Se confirma en hasta 24 horas.' },
];

const COUNTRIES = ['Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela', 'Otro país'];

const FAQ = [
  ['¿Cómo recibo mi juego?', 'Apenas se confirma el pago, el juego aparece en tu biblioteca con su botón de descarga. También recibes un correo con el recibo.'],
  ['¿Puedo comprar si no vivo en Latinoamérica?', 'Sí. Bravo está pensado para la región, pero cualquier persona puede comprar con tarjeta o billetera digital.'],
  ['¿Los precios incluyen impuestos?', 'Sí. El precio de cada ficha es el precio final en USD; no se suma nada en el último paso.'],
  ['¿Qué necesito para jugar?', 'Una PC con Windows que cumpla los requisitos de la ficha. Descargas el instalador desde tu biblioteca.'],
  ['Tengo un estudio, ¿cómo publico mi juego?', 'Postúlalo desde <a href="#/publicar">Publica en Bravo</a>. Revisamos cada juego y te respondemos por correo.'],
];
