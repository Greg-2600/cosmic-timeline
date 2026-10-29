/**
 * Cosmic Timeline — core data & pure logic.
 *
 * Everything in this module is DOM-free so it can be unit tested
 * with plain Node. In the browser it attaches as window.TimelineCore;
 * in Node it exports a CommonJS module.
 */
(function (root, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else {
    root.TimelineCore = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

const MILESTONES = [
  {
    title: "The Big Bang",
    yearsAgo: 13_800_000_000,
    era: "Cosmic origins",
    kid: "Everything — every star, every planet, every person — used to be squeezed into a dot smaller than this full stop. Then, WHOOSH! The universe started stretching like an inflating balloon, and it is still stretching right now.",
    fun: "You are made of atoms forged in the Big Bang's very first minutes plus atoms cooked inside stars. You are literally star dust.",
    summary: "Space, time, matter and energy all begin together in an incredibly hot, dense state that expands and cools. Within minutes the first hydrogen and helium nuclei form; after ~380,000 years the fog clears and light travels freely for the first time. All galaxies, stars and planets grow out of small ripples seeded during that first instant.",
    deep: [
      "Cosmic Microwave Background (CMB): the afterglow released ~380,000 years after the start, now cooled to 2.725 K, mapped by COBE, WMAP and Planck.",
      "Ripples in the CMB are about 1 part in 100,000 — those tiny density variations grown into every galaxy and cluster via gravity.",
      "Big Bang nucleosynthesis predicts a ~75% hydrogen / ~25% helium mix by mass, matching observations almost exactly.",
      "At ~1 second the universe was ~10 billion K. Physicists can test back to fractions of a second; the Planck epoch ( first 10^-43 s) remains beyond our best theories.",
      "Open question: what 'started' it, and whether cosmic inflation, a quantum fluctuation or something else lies behind the hot dense state.",
    ],
  },
  {
    title: "First Stars Ignite",
    yearsAgo: 13_600_000_000,
    era: "Cosmic origins",
    kid: "The universe was dark and full of invisible gas clouds for millions of years. Then the very first stars switched on like giant lighthouses, burning up to 40 times brighter than our Sun!",
    fun: "Those first stars may have been true monsters — some probably weighed as much as a thousand Suns packed together.",
    summary: "Gravity pulled hydrogen and helium into the densest pockets of gas, where pressure and heat lit the first fusion furnaces. These stars ended as supernovae that polluted space with carbon, oxygen, iron and the other elements planets and people are made from.",
    deep: [
      "Estimated ~100–400 million years after the Big Bang; unconfirmed individually, but JWST candidate galaxies pushed 'when did stars turn on' earlier than expected.",
      "First stars (Population III) had almost no metals, so they could grow very massive and were extremely hot and blue.",
      "Their ultraviolet light reionized hydrogen across space — the 'Epoch of Reionization' ended roughly 1 billion years in.",
      "Supernova yields seeded the interstellar medium: every element heavier than helium, including the Ca in your bones, is stellar.",
    ],
  },
  {
    title: "Milky Way Forms",
    yearsAgo: 13_500_000_000,
    era: "Galaxies",
    kid: "Billions of little groups of stars bumped and merged together like soap bubbles in a bath, until a huge spiralling island of stars formed. Our Sun lives in one of its arms, about halfway out from the middle!",
    fun: "The Milky Way has eaten at least a dozen smaller galaxies — and it is still swallowing one right now, called the Sagittarius dwarf.",
    summary: "Our home galaxy assembled from the merger of many smaller protogalaxies, forming a flattened rotating disk inside a vast halo of dark matter. Its oldest stars are nearly as old as the universe itself.",
    deep: [
      "Contains roughly 100–400 billion stars; disk ~100,000 light-years across and only ~1,000 light-years thick.",
      "Evidence of early mergers (e.g. Gaia-Enceladus/Sausage ~10 billion years ago) shows up as streams of stars with distinct chemistry and orbits.",
      "Sun orbits ~8 kpc from the centre, doing one lap every ~230 million years — a 'galactic year'.",
      "Most of the mass is invisible dark matter, inferred from stellar rotation speeds that outpace visible mass by far.",
    ],
  },
  {
    title: "Quasars Light Up",
    yearsAgo: 13300000000,
    era: "Galaxies",
    kid: "Some young galaxies grew huge, hungry black holes in their centres. When stars and gas fell in, the glowing blast was brighter than a hundred galaxies - the most brilliant beacons the universe has ever known!",
    fun: "The first quasar ever spotted, 3C 273, looked so star-like that 'quasi-stellar radio source' got squashed into 'quasar'.",
    summary: "In the universe's first few billion years, gas-rich galaxies built central supermassive black holes that devoured matter at enormous rates. Their glowing accretion disks outshone whole galaxies - the quasar era - heating and ionising gas around them.",
    deep: [
      "The brightest known quasar, 3C 273, is ~2.4 billion light-years away and about 4 trillion times as bright as the Sun.",
      "A feeding supermassive black hole can eat several Suns of matter every year during the quasar epoch; today most supermassive black holes are quiet.",
      "Quasars work as cosmic backlights: shining through clouds of hydrogen, they let astronomers find the universe's missing ordinary matter.",
      "Blasting winds from quasars can blow gas right out of a galaxy - one reason giant galaxies calmed down.",
    ],
  },
  {
    title: "Cosmic Noon",
    yearsAgo: 11000000000,
    era: "Galaxies",
    kid: "Around this time, thousands of galaxies threw a building party at once. New stars were popping into existence about ten times faster than today - the young universe glittered like a box of fireworks going off everywhere!",
    fun: "'Cosmic noon' is a real term astronomers use for this peak of galaxy building.",
    summary: "About 3 billion years after the Big Bang, star formation across the whole universe hit its all-time peak. Gas-heavy galaxies collided and merged at record rates, turning enormous clouds of hydrogen into new stars roughly ten times faster than the modern universe manages.",
    deep: [
      "The cosmic star-formation peak (redshift ~2) was about ten times today's rate, producing most of the stars alive right now.",
      "Galaxies at cosmic noon are smaller, gas-rich and turbulent, with clumpy star-forming knots instead of tidy spiral arms.",
      "Mapping the slow decline since noon is one of astronomy's great unfinished charts - and JWST is filling it in.",
      "If you folded every star born since into one sheet, most of it was stamped at cosmic noon.",
    ],
  },
  {
    title: "The Cosmic Web Forms",
    yearsAgo: 9000000000,
    era: "Galaxies",
    kid: "If you could see the whole universe out to billions of light-years at once, it would look like a giant spider web. Galaxies sit on gossamer threads of dark matter, with enormous empty rooms in between!",
    fun: "The biggest known cosmic void, the Boötes Void, is so empty it could hold 10,000 Milky Ways.",
    summary: "Under gravity, dark matter collected into a connected network of filaments and sheets - a cosmic web - with galaxy clusters gathering at its knots. By about 5 billion years ago the web had settled into the giant pattern we map today.",
    deep: [
      "Structure grew 'bottom-up': tiny density ripples became galaxies, then clusters, then the web of filaments and knots.",
      "The Sloan Digital Sky Survey produced 3-D galaxy maps that showed the web directly for the first time (2000s).",
      "The largest web features - voids like Boötes, superclusters like our Laniakea - span roughly a billion light-years.",
      "Dark energy is now stretching the web apart faster than gravity can keep weaving.",
    ],
  },
  {
    title: "Dark Energy Takes Over",
    yearsAgo: 7000000000,
    era: "Galaxies",
    kid: "For billions of years gravity kept pulling everything closer together. Then a mysterious push - dark energy - started to win, and the universe began stretching faster and faster. The cosmic story turned a page!",
    fun: "We have no idea what dark energy actually is. Honestly. That is the fun part.",
    summary: "Around 6-7 billion years ago the expansion of the universe stopped slowing down and started speeding up - the handover from matter-driven slowdown to dark-energy-driven acceleration. Distant clusters now race away from each other faster and faster.",
    deep: [
      "The acceleration was discovered in 1998 by measuring Type Ia supernovae as 'standard candles' - it earned the 2011 Nobel Prize.",
      "Dark energy is about 68% of the universe's energy budget, yet its nature is completely unexplained.",
      "Einstein called his cosmological constant his 'biggest blunder' - the measurements then handed it right back to us.",
      "If the cosmological constant stays constant, the far future is a heat death: drift apart, cool down, fade out.",
    ],
  },
  {
    title: "Solar System Forms",
    yearsAgo: 4_600_000_000,
    era: "Solar System",
    kid: "A huge cloud of gas and dust got squished and started spinning like water going down a drain. In the middle it got so hot it lit up — that's our Sun. Around it, dust bunnies stuck together into bigger and bigger rocks until they became planets!",
    fun: "The leftovers became a giant belt of rubble between Mars and Jupiter, and icy building blocks far beyond Neptune.",
    summary: "A giant molecular cloud — probably nudged by a nearby supernova — collapsed into a spinning disk. The Sun ignited at its centre, and planets, moons, asteroids and comets accreteted from the leftover material.",
    deep: [
      "Calcium-aluminium-rich inclusions in meteorites date solar system formation to 4.567 billion years ago — the definitive 'second hand' of planetary clocks.",
      "Beyond the 'frost line' it was cold enough for ices, which is why Jupiter/Saturn grew gas giants while Mercury–Mars stayed rocky.",
      "Simulations (the Nice model) suggest the giant planets migrated, and that Jupiter's wander explains the inner solar system's makeup.",
      "Proto-planetary disks are directly imaged (ALMA) around young stars — snapshots of exactly how ours began.",
    ],
  },
  {
    title: "Earth Forms",
    yearsAgo: 4_540_000_000,
    era: "Solar System",
    kid: "Baby Earth was basically a giant ball of lava soup, with rocks crashing into it all day long. A Mars-sized planet smashed into it, and the spray that flew off became our Moon!",
    fun: "Because of that crash, the Moon is slowly drifting away from us — about 3.8 cm every year, roughly the speed your fingernails grow.",
    summary: "Earth accreted from colliding planetesimals into a molten, volcanic world with no oxygen atmosphere. A giant impact with a Mars-sized proto-planet (Theia) ejected a debris ring that became the Moon; the surface later solidified and water condensed into oceans.",
    deep: [
      "Radiometric dating of zircons pushes evidence of crust and liquid water back to ~4.4 billion years — surprisingly soon after accretion.",
      "Giant-impact hypothesis explains the Moon's low iron, Earth's 23.5° tilt and the Earth–Moon angular momentum; models win when Theia hit at just the right speed and angle.",
      "The core formed by iron sinking through a magma ocean, a process that still powers Earth's magnetic dynamo today.",
      "Late Heavy Bombardment evidence is hints from lunar cratering ages; the idea of a single 'spike' of impacts is increasingly debated.",
      "Ocean water may have arrived with icy asteroids plus outgassed steam — the ratio of deuterium to hydrogen is the clue used to test the idea.",
    ],
  },
  {
    title: "The Moon Forms",
    yearsAgo: 4500000000,
    era: "Solar System",
    kid: "A Mars-sized planet named Theia slammed into baby Earth. The splash flew into space and - SPLOOSH - all that debris stuck together and became the Moon. Our very own satellite was born in a collision!",
    fun: "Moon rocks brought home by Apollo astronauts are missing iron - exactly what you would expect from debris thrown off Earth's iron-heavy core.",
    summary: "Just after Earth grew, a Mars-sized proto-planet struck a glancing blow. The collision thrown off a ring of molten debris that cooled and clumped into the Moon, swung into orbit, and began - very slowly - drifting away.",
    deep: [
      "Moon-rock chemistry matches Earth's mantle, supporting the giant-impact origin story.",
      "Laser reflectors left on the surface show the Moon receding ~3.8 cm per year - momentum conserved across space.",
      "The impact likely reset Earth's tilt spin and clocked a 5-hour day; tides slowed us to 24 hours over billions of years.",
      "Adjacent debate: exact impact size, angle and how completely Earth and Theia mixed.",
    ],
  },
  {
    title: "The First Oceans",
    yearsAgo: 4400000000,
    era: "Solar System",
    kid: "Earth cooled down for the very first time. Steam clouds rained and rained for thousands of years - until the whole world was puddle-deep. The first oceans splashed into existence, ready for life!",
    fun: "Water may have arrived on icy asteroids - hydrogen isotopes in Earth's ocean hint at that origin.",
    summary: "As Earth's surface cooled below boiling, steam from outgassing volcanoes and water delivered by icy bodies condensed into a global ocean. Ancient zircon crystals show liquid water existed barely 100 million years after the planet formed.",
    deep: [
      "Jack Hills zircons (~4.4 billion years) are the oldest known bits of Earth and carry chemical evidence of water.",
      "Sea water probably arrived with icy asteroids plus steam belched by volcanoes; the hydrogen isotope ratio is the detective's clue.",
      "Early oceans were warm, iron-rich and no oxygen — a chemical playground for the first metabolism.",
      "A Moon twice as close as today drove monstrous tides, churning shorelines that some theories love for origin-of-life chemistry.",
    ],
  },
  {
    title: "Late Heavy Bombardment",
    yearsAgo: 4100000000,
    era: "Solar System",
    kid: "For millions of years, space rocks kept pelting the young planets like a meteorite blizzard. The Moon remembers it best: its ancient faces are still covered in craters from this heavy cosmic hailstorm!",
    fun: "The Apollo Moon landings backed this theory up: moon rocks date the bombardment right to this window.",
    summary: "Between about 4.1 and 3.8 billion years ago, the inner planets took a spike of impact from displaced asteroids and comets - probably flung inwards as the giant planets shifted orbits. Earth's early crust may have been re-melted repeatedly.",
    deep: [
      "Crater-count dating across the Moon's surface drove the LHB idea; lunar samples put impact melt ages ~3.9 Gyr.",
      "Modern modellers debate whether it was a single spike, a slow tail, or planet-shuffling giants like Jupiter migrated inwards.",
      "Some hypotheses: late-arriving water and organics may have hitch-hiked in on this bombardment.",
      "Earth keeps almost no record — plate tectonics recycled the evidence, and craters few older than ~2 Gyr survive on land.",
    ],
  },
  {
    title: "First Life Appears",
    yearsAgo: 3_800_000_000,
    era: "Life",
    kid: "In warm underwater springs, tiny chemicals got together and started doing something amazing: copying themselves. They were teeny-tiny — no bigger than a single speck of dust — but they were the very first living things!",
    fun: "Head to Western Australia and you can touch fossilised mounds (stromatolites) made by ancient bacteria 3.5 billion years ago.",
    summary: "Simple single-celled organisms — bacteria and archaea without nuclei — arise in Earth's oceans, likely near hot, mineral-rich hydrothermal vents. They metabolise chemical energy and reproduce, setting the template for every living thing to come.",
    deep: [
      "Carbon isotope ratios in rocks from Isua, Greenland hint at biology around 3.8 billion years back; firm microfossils are ~3.5 billion.",
      "Leading hypotheses: an 'RNA world' of self-copying RNA plus alkaline hydrothermal vents (Lost City type) providing energy gradients.",
      "LUCA — the Last Universal Common Ancestor — already used DNA, a genetic code and ATP; every modern organism descends from it.",
      "Abiogenesis in the lab: Miller-Urey made amino acids from simple gas and sparks; steady progress since, but a full cell from scratch remains unsolved.",
    ],
  },
  {
    title: "Photosynthesis Invented",
    yearsAgo: 3500000000,
    era: "Life",
    kid: "Some tiny cells learned the best trick in the history of the world: using sunlight as a battery. Green bacteria soaked up light, drank water and breathed out waste oxygen - free fuel for everything that came later!",
    fun: "One gram of a photosynthesis enzyme, called RuBisCO, is thought to be the most common protein on Earth.",
    summary: "By about 3.5 billion years ago, microbial mats had mastered oxygenic photosynthesis: sunlight + water + CO2 → sugar + oxygen. It took over a billion more years of oxygen sinks - rusting oceans - before that waste gas started filling the air.",
    deep: [
      "Fractionation of carbon isotopes in 3.5-Gyr rocks points to photosynthetic (or near-photosynthetic) metabolism already at work.",
      "Cyanobacteria are the only bacteria that figured out water-splitting photosynthesis — the single most impactful metabolic invention.",
      "Inventing oxygenic photosynthesis is a two-step operation (PSII + PSI); evolving it is effectively biology's own moon shot.",
      "Stromatolite mounds from Shark Bay, Australia are living descendants of those first photosynthetic mats.",
    ],
  },
  {
    title: "Oxygenation of the Atmosphere",
    yearsAgo: 2_400_000_000,
    era: "Life",
    kid: "Tiny green goo-bacteria invented the best trick in history: eating sunlight and breathing out oxygen. Trouble is, oxygen was poisonous to almost everything back then, so lots of the old microbes died. New life learned to love it — and that's the air you breathe!",
    fun: "All that free oxygen rusted the iron in the oceans. The rusty sea floor is now stripes of red rock called 'banded iron formations'.",
    summary: "Cyanobacteria mastered oxygenic photosynthesis, pumping O2 into air and oceans. The resulting Great Oxidation Event poisoned much of the ancient biosphere while opening the door to energy-rich, oxygen-breathing life.",
    deep: [
      "Banded Iron Formations (BIF) show Fe(II) oxidised to Fe(III) as oceans were swept of iron — direct chemical evidence for rising O2.",
      "Mass-independent sulphur isotope anomalies vanish after ~2.33 billion years: Earth's atmosphere first gained a real ozone-laced, O2-rich state.",
      "Likely triggered three or more global glaciations (Huronian/snowball events) as methane, a potent greenhouse gas, was destroyed.",
      "O2 levels stayed <1% for another ~1.5 billion years, until ~600 million years ago, eukaryotes and especially animals could finally thrive.",
    ],
  },
  {
    title: "Complex Cells (Eukaryotes)",
    yearsAgo: 1800000000,
    era: "Life",
    kid: "One cell swallowed another and - instead of digesting it - kept it as a tiny helper! The engulfed cell became the cell's own power plant. That messy handshake created all complex life: plants, mushrooms, animals, you!",
    fun: "The power station inside your cells - the mitochondrion - was once a free-living bacterium with its own DNA.",
    summary: "Around 1.8-2 billion years ago, one cell engulfed another but kept it alive: the ancestor of mitochondria, the cell's powerhouse. The result was the first eukaryote — a cell with a nucleus and energy to spare, the ancestor of all plants, animals, fungi and protists.",
    deep: [
      "Endosymbiosis: mitochondria (and chloroplasts in plants) keep their own DNA — a fossil record of their bacterial origin.",
      "Prokaryotes divide power budget almost equally; eukaryotes gained energy per gene — raw fuel for complexity.",
      "Which host and which guest (archaeal vs bacterial) is the subject of energetic biology work by Nick Lane and Martin.",
      "Timing in the record is still hotly debated: fossil claims go back to 1.8-2.5 Gyr; some molecular clocks say earlier.",
    ],
  },
  {
    title: "Cells Begin Pairing Up (Sex Evolves)",
    yearsAgo: 1200000000,
    era: "Life",
    kid: "Cells discovered a smarter way to make babies: instead of one cell splitting in two, two cells swapped genes first. That gene-mixing trick meant faster evolution - and it is why you are not an exact copy of your parents!",
    fun: "One result: males and females. Sex needs two different cell types to tango.",
    summary: "Sexual reproduction - merging and recombining genes from two parents - appears in the fossil record around 1.2 billion years ago. Its key value: recombination shuffles genes each generation, letting populations adapt faster and purge harmful mutations.",
    deep: [
      "Red Queen theory: parasites adapt faster than hosts, so shuffling genes each generation is a moving defense.",
      "Costly it is: halved reproduction rate per parent, so its persistence instead needs a big evolutionary payoff.",
      "Gamete dimorphism (egg/sperm) may have evolved as selection pushed specialisation in cell size.",
      "Meiosis - shuffling DNA then splitting - appeared by ~1.2 Gyr in red algae fossils (Bangiomorpha).",
    ],
  },
  {
    title: "Snowball Earth",
    yearsAgo: 700000000,
    era: "Life",
    kid: "Earth did something wild: it froze over almost completely, pole to pole! Ice a kilometre thick, oceans frozen, and yet life survived underneath. Twice. Rocks from this time show it really happened, more than once.",
    fun: "The ice's meltwater may have dumped nutrients into the ocean - a possible launch pad for the first animals.",
    summary: "At several points during the Cryogenian period (~720 and ~635 million years ago), ice sheets reached the tropics and possibly froze oceans nearly solid. The glacial debris adds up: 'cap carbonates' rest on glacial rock worldwide.",
    deep: [
      "Geologists found glacial drop-stones near the equator in ancient marine deposits — killer evidence for global ice.",
      "Volcanic CO2, unregulated by weathering during a frozen Earth, slowly warmed the planet out of the freeze — dramatic swings.",
      "Meltdown pulses could have fertilised the ocean with nutrients, setting the table for complex animal life.",
      "Snowball volcanism theory derived from climate modelling (Kirschvink, 1992) only after rock evidence piled up.",
    ],
  },
  {
    title: "First Complex Life",
    yearsAgo: 600_000_000,
    era: "Life",
    kid: "The ocean suddenly got busy! Creatures grew eyes, shells, arms and teeth, and started gobbling each other up — all in a blink of geological time. It was like a big underwater market day appearing out of nowhere.",
    fun: "One early animal, Opabinia, had five eyes and a vacuum-cleaner trunk. Evolution was experimenting wildly.",
    summary: "Multicellular organisms — first soft-bodied (Ediacaran), then a burst of mineralised and recognisable animal body plans in the Cambrian Explosion — took over the seas. Predators, eyes, shells and complex behaviour appear in the fossil record.",
    deep: [
      "Ediacaran biota (~571 million years onward) includes odd fronds like Charnia; many left no clear descendants.",
      "Cambrian Explosion (~541 million years) produced most major animal phyla within ~25 million years, preserved spectacularly at sites like Chengjiang and the Burgess Shale.",
      "Enabling factors: rising oxygen past a threshold, evolution of Hox gene toolkits, and a predator-prey 'arms race' driving hard parts and eyes.",
      "Molecular clocks show animal origins predate the visible explosion — the fossil record 'turns on' when shells appear.",
    ],
  },
  {
    title: "Plants Cover the Land",
    yearsAgo: 470000000,
    era: "Life",
    kid: "Green things crawled out of the water! Only mosses and slimy mats at first, but plants changed the planet: they grabbed CO2, held soil together with roots, and slowly made the land a friendly place for animals.",
    fun: "Land plants may have cooled the planet so much they helped trigger an ice age around 445 million years ago.",
    summary: "From around 470 million years ago, algae-like ancestors produced the first land plants. Over millions of years, rooted vascular plants slowed erosion, built soils, dragged CO2 down (cooling the world) and made the land surface hospitable to animal life.",
    deep: [
      "Ordovician spore fossils show plants were on land ~30 million years before the first forests.",
      "Plants tripled global soil-weathering rates, sending calcium to the ocean and — with it — long-term CO2 drawdown.",
      "Coal-forming Carboniferous forests (300 Myr on) later gave us most of our fossil-fuel reserves.",
      "The first insects followed the plants ashore, basically eating the new buffet.",
    ],
  },
  {
    title: "Fish Walk onto Land",
    yearsAgo: 375000000,
    era: "Life",
    kid: "A fish with chunky, muscular fins dragged itself out of the shallow water and learned to breathe air. Its descendants became every four-legged animal: frogs, snakes, birds, dinosaurs, dogs - and us!",
    fun: "Tiktaalik's fin bones match your arm bones almost one-for-one: humerus, radius, ulna, wrist.",
    summary: "Around 375 million years ago, lobe-finned fish like Tiktaalik roseae hauled onto muddy banks using weight-bearing fins and lung-like breathing. This fish-to-tetrapod transition is the origin of every land vertebrate's limbs.",
    deep: [
      "Tiktaalik (found on Ellesmere Island, 2004) has a neck — fish don't — great for peering above water.",
      "Fossil series from fish to tetrapods (Eusthenopteron → Panderichthys → Tiktaalik → Acanthostega) is palaeontology's showcase.",
      " limbs first evolved for pushing in shallow water, not necessarily for walking - legs got boring bragging rights later.",
      "Some early tetrapods had 6-8 fingers; five came later as the standard plan.",
    ],
  },
  {
    title: "The Coal Forests",
    yearsAgo: 300000000,
    era: "Life",
    kid: "Giant trees taller than today's skyscraper neighbourhoods grew in steaming swamps. When they died, they piled up in water where nothing could rot them - and turned into a planet-sized pile of coal over millions of years!",
    fun: "The Carboniferous gets its name from these coal beds, (carbon = coal).",
    summary: "During the Carboniferous period, vast swampy forests of giant club-moss trees buried carbon faster than microbes could decay it — wood-decay enzymes may not even have evolved yet. Sealed and pressured over time, these deposits became the planet's major coal seams and drove atmospheric oxygen to record highs.",
    deep: [
      "Oxygen peaked around 35%, letting dragonflies the size of hawks to fly.",
      "Lignite, bituminous coal and anthracite are coal's sequential cooking stages from swamp mush.",
      "This carbon burial turned the Carboniferous into a glacial period: ocean temperatures fell, and southern ice caps expanded.",
      "Decaying giants also left most of the planet's oil and gas although those mostly formed from marine plankton.",
    ],
  },
  {
    title: "The Great Dying",
    yearsAgo: 252000000,
    era: "Life",
    kid: "Before the dinosaurs ever existed, something even worse happened: the biggest extinction ever - about 9 out of 10 species vanished! But life never gave up. The survivors started the whole story over again.",
    fun: "It took life up to 10 million years to fully bounce back — the most patient comeback in history.",
    summary: "The end-Permian extinction (~252 million years ago) killed ~81% of marine species. Massive volcanic eruptions in Siberia poured CO2, warmed the oceans, deoxygenated them and acidified the seas. The biosphere nearly collapsed — and then took millions of years to rebuild.",
    deep: [
      "Siberian flood basalts cover ~2 million square kilometres — lava volume enough to cover Florida in a 4 km-high blanket.",
      "Ocean anoxia + acidification wrote the extinction record now visible in sedimentary rocks via isotope shifts and boron chemistry.",
      "Fun detail: Lystrosaurus, one survivor, briefly dominated Earth — the first 'weedy' species in history.",
      "The catastrophe reset reptile diversity and set the stage for archosaurs — dinosaur ancestors — to rise.",
    ],
  },
  {
    title: "Dinosaurs Appear",
    yearsAgo: 230_000_000,
    era: "Life",
    kid: "Some scaly, sometimes feathered giants ruled Earth for 160 million years. Some grew taller than a double-decker bus with a neck like a giraffe, and others had teeth the size of bananas!",
    fun: "Velociraptor was only about the size of a turkey — and yes, it almost certainly had feathers.",
    summary: "Dinosaurs emerge in the Late Triassic and dominate terrestrial ecosystems for over 150 million years, evolving into everything from tiny hummingbird-like flyers to 70-ton sauropods. Mammals exist but stay small and nocturnal.",
    deep: [
      "Dinosauria is split into Saurischia and Ornithischia; early forms like Eoraptor and Herrerasaurus appear in Argentina's Ischigualasto Formation.",
      "Sauropod gigantism relied on air-skeleton pneumaticity, efficient bird-like lungs and egg laying (no live birth to limit parent size).",
      "Feathers or feather-like filaments turn up across many lineages (not just birds), suggesting a shared ancestral trait.",
      "The K-Pg impact that ends them may have been easier to survive because mammals, birds and other small creatures were already living 'fast' life histories.",
    ],
  },
  {
    title: "Dinosaur Extinction",
    yearsAgo: 66_000_000,
    era: "Life",
    kid: "One very bad day, a giant space rock as big as a mountain smashed into Mexico. The sky went dark, the weather went crazy, and almost every dinosaur died off. But the small, furry, sneaky mammals — our ancestors — made it through!",
    fun: "Birds are living dinosaurs. A pigeon is more closely related to T. rex than T. rex was to a Stegosaurus.",
    summary: "An asteroid strikes the Yucatán Peninsula (Chicxulub), triggering global climate chaos that ends the age of dinosaurs except birds. This clears the way for mammals to diversify into every habitat.",
    deep: [
      "Chicxulub crater is ~180 km wide; the ~10–12 km impactor released energy roughly a billion Hiroshima bombs.",
      "Sulphate aerosols + soot from global wildfires collapsed photosynthesis; a long 'impact winter' plus ocean acidification drove ~75% of species extinct.",
      "The Cretaceous-Paleogene boundary layer worldwide contains shocked quartz, tektites and an iridium spike — classic impact markers.",
      "Freshwater animals, small burrowing omnivores and seed-eaters had the best odds; the 'fern spike' shows plants recovering within years.",
      "Ongoing debate: Deccan volcanism added stress, but high-precision dating pins the extinction tightly on the impact window.",
    ],
  },
  {
    title: "Whales Return to the Sea",
    yearsAgo: 50000000,
    era: "Life",
    kid: "Some furry, four-legged land animals went for a swim... and never came back! Their legs slowly shrank into flippers, their noses slid up their heads to breathe on top, and they became whales and dolphins.",
    fun: "Whale hip bones still exist inside their bodies — a souvenir of the days they walked.",
    summary: "About 50 million years ago, small hoofed land mammals (like Pakicetus) took to the water. Over tens of millions of years their legs became flippers, nostrils migrated to the top of the skull and they became fully aquatic whales and dolphins.",
    deep: [
      "Pakicetus (Pakistan, ~50 Myr) looked like a wolf with swimming ankles; Ambulocetus could walk and swim.",
      "Whales and hippos sit together on the evolutionary tree: even-toedhoofed mammals (Artiodactyla).",
      "Blue whales eat krill and are the largest animals ever — bigger than any dinosaur known.",
      "Vestigial pelvis and hind-limb bones still float inside their bodies — proof of the land legacy.",
    ],
  },
  {
    title: "The First Apes",
    yearsAgo: 25000000,
    era: "Humans",
    kid: "In African forests, some monkeys started spending more time up in the trees, swinging with long arms and no tail. Those acrobats were the first apes - the family our great-great-great grandparents come from!",
    fun: "Apes lost their tails through a mutation in a gene related to tail growth — a minor tweak with huge results.",
    summary: "Around 25 million years ago, African primates diverged from monkey ancestors, giving rise to apes: bigger brains, long arms, no tails, more upright postures. One lineage of apes would eventually walk out onto the savanna and become us.",
    deep: [
      "Proconsul (~20 Myr, Kenya) is a classic early ape — monkey-brained but tail-less and ape-limbed.",
      "Apes arose during a global warming period (Miocene Climatic Optimum) when forests expanded across Africa and Eurasia.",
      "Apes later branched into gibbons, orangutans, gorillas, chimps and — eventually — us.",
      "Fewer offspring and longer childhoods: apes invest in clever kids, not big litters.",
    ],
  },
  {
    title: "First Hominids",
    yearsAgo: 7_000_000,
    era: "Humans",
    kid: "Somewhere in the forests of Africa, a group of apes started doing something strange: standing up and walking on two legs. That quirky habit would eventually lead to us!",
    fun: "These apes' brains were about the same size as a chimpanzee's — walking upright came long before big brains.",
    summary: "The human lineage splits from chimpanzees; early hominids walk upright in African woodlands and savannas, gradually freeing their hands and shifting their diet and social life.",
    deep: [
      "Sahelanthropus tchadensis (~7 million years, Chad) and Orrorin tugenensis (~6 Ma) are the earliest candidates for bipedal apes.",
      "Ardipithecus (~4.4 Ma, Ethiopia) shows a mosaic of climbing hands and bipedal feet — transitional between tree-living and walking.",
      "Laetoli footprints (3.66 Ma, Tanzania) prove habitual bipedalism in Australopithecus afarensis ('Lucy' species).",
      "Genetic comparison with chimpanzees puts the human–chimp split between roughly 6 and 8 million years with a long, messy speciation.",
    ],
  },
  {
    title: "Fire in Our Hands",
    yearsAgo: 1000000,
    era: "Humans",
    kid: "Someone figured out how to keep fire going - and then how to make it! Suddenly nights weren't dark or shivering, food got cooked (yum!), and around every fire, stories were told. Cooking may have made our brains possible.",
    fun: "Cooking softens food, so our guts shrank and our brains grew - the 'cooking hypothesis'.",
    summary: "Control of fire - probably by Homo erectus or later - is dated conservatively to around a million years ago and may be far older. Fire offered warmth, protection, light, defence and — most powerfully — cooked food, which unlocked more energy per bite.",
    deep: [
      "The oldest firm hearths (Gesher Benot Ya'aqov, Israel) date to ~790,000 years ago.",
      "Wrangham's cooking hypothesis links fire to shrinking guts, bigger brains, and pair-bond food sharing.",
      "Fire is a technology: it extends reach into inland forests, colder climates, and the night itself.",
      "The ability to make fire (not just keep it) may be much more recent — as late as Neanderthal times.",
    ],
  },
  {
    title: "Homo sapiens",
    yearsAgo: 300_000,
    era: "Humans",
    kid: "People just like you and me — same brains, same curiosity — appear in Africa. They draw, make jewellery, bury their dead and tell stories around campfires. In time, they walk out of Africa and around the whole world!",
    fun: "Every single person alive today can trace their family tree back through Africa — and a bit of Neanderthal DNA probably hitched a ride into your genome along the way.",
    summary: "Anatomically modern humans evolve in Africa, with larger brains, complex language, symbolic art and social networks. They interbreed with archaic humans they meet (Neanderthals, Denisovans) and spread across the globe.",
    deep: [
      "Jebel Irhoud, Morocco fossils (~315,000 years) plus Florisbad and Omo Kibish push the origin of Homo sapiens far earlier than once thought.",
      "Middle Stone Age tech: Levallois stone knapping, long-distance trade in ochre and shells, advanced composite tools.",
      "Out-of-Africa dispersal main wave ~70,000–50,000 years ago, genome-wide evidence of limited introgression from Neanderthals (~2%) and Denisovans.",
      "Behavioural 'modernity' shows in Blombos Cave (South Africa) engraved ochre ~75,000 years and Shell beads from South Africa and across the Levant.",
      "Non-trivial debate remains on how quickly language and symbolic thought fully emerged — proxies include burials, curated tools and art.",
    ],
  },
  {
    title: "Out of Africa",
    yearsAgo: 70000,
    era: "Humans",
    kid: "A small group of humans walked out of Africa, along the coasts and across the land bridges - into Asia, Australia, Europe and eventually the Americas. After hundreds of thousands of years, people finally populated the whole planet!",
    fun: "Every non-African person alive today carries a little Neanderthal DNA aboard.",
    summary: "Around 70,000-50,000 years ago, populations carrying modern human culture moved out of Africa and across the globe. We met and mixed a little with other human species (Neanderthals, Denisovans) who had already left — evidence lives on in our genomes.",
    deep: [
      "All present-day non-Africans descend largely from a single exit wave dated by genetics to ~70,000 years ago.",
      "Australia was reached by boats ~65,000 years ago - the first ocean crossing of a continent.",
      "Neanderthal and Denisovan DNA lives on: ~2% in many people today; some highlanders carry more Denisovan genes.",
      "Sea levels were ~120 m lower then: coastlines like Sundaland, now drowned, were some of the earliest routes.",
    ],
  },
  {
    title: "Agriculture Begins",
    yearsAgo: 12_000,
    era: "Civilization",
    kid: "Instead of chasing dinner around, people learned to plant seeds and wait for them to grow into food. They tamed wolves into dogs, wild goats into goats, and grass into wheat!",
    fun: "Once people could store grain, some could spend time doing other things — inventing maths, pottery and eventually writing.",
    summary: "Humans shift from hunting and gathering to farming, domesticating plants and animals independently worldwide. Permanent settlements and villages grow, populations expand, and the stage is set for cities and states.",
    deep: [
      "Independent domestication events: Fertile Crescent wheat/barley/sheep (~10,500 BP), China rice/millet, Mesoamerica maize (from teosinte), Andes potato/llama, New Guinea taro.",
      "Teosinte to maize involved a handful of key genetic changes (tga1 control), tracked by corn genetics and archaeological cob morphology.",
      "Göbekli Tepe (~9,500 BP) hints that monumental building and feasting networks may have preceded even the earliest farming.",
      "Neolithic demographic transition: farmer populations grew dramatically, shifting global demographics and spreading languages with them.",
      "Costs and side effects: disease from crowding, dental decay from carbohydrates, and social stratification when stores could be owned.",
    ],
  },
  {
    title: "Creation",
    yearsAgo: 6000,
    era: "Biblical",
    kid: "The Bible opens with a beautiful song: God spoke, and light, stars, oceans and creatures appeared one day at a time, until people arrived to look after the garden. And God looked at it all and said: it is very good!",
    fun: "The Bible's first three words - 'In the beginning' - open one of the most-read books in human history.",
    summary: "Genesis 1-2 describes God creating the universe in six days and resting on the seventh. Believers have read it as history, poetry and theology. The genealogies in Genesis 5 and 11 inspired traditional chronologies - Bishop Ussher computed 4004 BCE, i.e. about 6,000 years ago.",
    deep: [
      "Ussher's chronology (1650) dated creation to the evening of 22 October 4004 BCE by adding up the Bible's lifespan lists.",
      "Independent evidence instead: redshift and the cosmic microwave background give 13.8 billion years; many traditions read Genesis as an ordered theological pattern rather than a lab report.",
      "The text reshapes older Mesopotamian epics (Enuma Elish): one God creates by speaking rather than by battle.",
      "The seven-day week itself traces to the creation week - no astronomical basis, purely scriptural.",
    ],
  },
  {
    title: "The Wheel Turns",
    yearsAgo: 5600,
    era: "Civilization",
    kid: "Someone looked at a log rolling sideways and thought: what if I put that under a cart? The wheel was invented - and suddenly heavy things could move. Trade, travel and cities all started rolling!",
    fun: "The wheel was used first as a potter's tool, before anyone thought to put it on a cart.",
    summary: "Around 3500 BCE in Mesopotamia (and likely independently elsewhere), humans attached rotating discs to axles and built the wheel. Pottery wheels pre-dated transport wheels; once carts rolled, trade networks, roads — and eventually cities — scaled up.",
    deep: [
      "The oldest known wheels (wagon) date to ~3500 BCE at sites in Mesopotamia and Eastern Europe.",
      "Hub-and-axle engineering has subtleties: it took centuries to workout stable bearing design.",
      "The wheel is not in the Americas before European contact — the Inca built roads without them.",
      "Chariot wheels (like the Sintashta culture, ~2000 BCE) transformed ancient warfare.",
    ],
  },
  {
    title: "Writing Invented",
    yearsAgo: 5_400,
    era: "Civilization",
    kid: "People started pressing little picture-symbols into wet clay to keep count of their sheep and grain. Before long, they were writing real stories, laws and shopping lists!",
    fun: "We can still read letters from a merchant's wife dated 4,000 years ago, complaining that he never sends her anything nice.",
    summary: "The first true writing systems arise in Mesopotamia (cuneiform), Egypt (hieroglyphs) and later China and Mesoamerica. Recorded history — laws, trade, poetry, mathematics — becomes possible.",
    deep: [
      "Proto-cuneiform grows out of ~8000 BCE clay accounting tokens (Denise Schmandt-Besserat's hypothesis) and cuneiform tablets exist from ~3200 BCE.",
      "Decipherment stories: cuneiform via the Behistun inscription (Rawlinson), hieroglyphs via the Rosetta Stone (Champollion), Linear B by Ventris.",
      "Writing enables bureaucracy: temple economies, taxes, codified laws (Ur-Namma, Hammurabi), and the first named author — Enheduanna, priestess-poet of Ur.",
      "Independent inventions: Mesopotamia, Egypt (debated as independent), China (oracle bones, ~1200 BCE) and Mesoamerica (Olmec/Maya) — convergence of function, divergence of form.",
    ],
  },
  {
    title: "Menes Unifies Egypt",
    yearsAgo: 5100,
    era: "World Powers",
    kid: "Around 3100 BCE, a king called Narmer - also known as Menes - joined Upper Egypt and Lower Egypt into one mighty kingdom, and wore a double crown to prove it! Egypt then ran as a superpower for 3,000 years straight.",
    fun: "Narmer's carved stone palette is history's first surviving piece of 'propaganda art' - it advertises his unification victory.",
    summary: "Narmer/Menes (c. 3100 BCE) unified the Nile valley into the world's first large territorial state: hieroglyphic writing, provincial governors, pyramids and a bureaucracy that ran the river kingdom for ~3,000 years. Egypt defined what a 'world power' looked like for most of recorded civilisation.",
    deep: [
      "The Narmer Palette (~3100 BCE) shows the King wearing both crowns - civilisation's first labelled royal artwork.",
      "The Nile's predictable floods made Egyptian grain output the most reliable in the ancient world - power through agriculture.",
      "Giza's pyramids used engineering precision still discussed by modern civil engineers - the biggest structures on Earth for 3,800 years.",
      "Egypt lasted as a state until the Persian conquest in 343 BCE - longer than Christianity has existed.",
    ],
  },
  {
    title: "Great Pyramid of Giza",
    yearsAgo: 4_560,
    era: "Civilization",
    kid: "The Egyptians built a mountain out of stones — but they did it by hand, with ropes, ramps and a LOT of clever planning. Each block weighs as much as a fridge, and they placed more than two million of them!",
    fun: "It was the tallest building on Earth for almost 4,000 years — until Lincoln Cathedral's spire finally beat it around the year 1300.",
    summary: "The ancient Egyptians build the Great Pyramid for Pharaoh Khufu, a monument of astonishing precision that still stands today and embodies the organizational power of early states.",
    deep: [
      "Original height 146.6 m; base sides differ by under 4 cm and the cardinal alignment is accurate to ~0.07°.",
      "Modern papyrology (Diary of Merer, Wadi al-Jarf) documents limestone ferried down the Nile and reveals organised work crews, not slaves.",
      "Internal design: stress-relieving chambers, the Grand Gallery's corbelled vault, and precisely laid plugs and passages suggest both function and symbolic intent.",
      "Archaeology at Giza's workers' village ('Lost City of the Pyramid Builders') shows bakeries, breweries, medical care and skilled labour rotation.",
    ],
  },
  {
    title: "The Great Flood",
    yearsAgo: 4300,
    era: "Biblical",
    kid: "A world-flood story: God told Noah to build a giant boat called an ark, fill it with animal pairs two by two, and then rain fell for forty days and forty nights. When the boat landed on a mountain, a rainbow promised it would never happen again!",
    fun: "A 1:1 plywood replica of Noah's ark in the Netherlands is longer than a football pitch.",
    summary: "Genesis 6-9 tells of a flood covering the earth, Noah's ark and a rainbow covenant. Ancient Mesopotamia preserved similar flood epics (Gilgamesh, Atrahasis). Traditional chronologies place the flood around 2500-2100 BCE; historians debate what, if anything, inspired it.",
    deep: [
      "The Gilgamesh flood tablet (tablet XI) shares details with Genesis: birds sent out, landing on a mountain.",
      "'Flood geology' claims a recent global flood but is rejected by mainstream geologists; the Black Sea deluge (~5600 BCE) is one proposed local inspiration.",
      "The ark's specs (~137 m long) are given in cubits in Genesis 6.",
      "The rainbow covenant (Genesis 9) becomes the story's closing image - a promise, not punishment.",
    ],
  },
  {
    title: "Abraham's Journey",
    yearsAgo: 4000,
    era: "Biblical",
    kid: "God told Abraham to leave his home and travel to a new land he would show him - a promise sealed with the stars: 'count the stars, if you can. So will your descendants be!' Three great religions trace their family tree back to him.",
    fun: "Abraham is honoured as a patriarch by Judaism, Christianity AND Islam - the 'Abrahamic religions'.",
    summary: "Genesis 12 records Abram leaving Ur for Canaan on God's promise, marking the covenant with the Jewish people. His sons Ishmael and Isaac link Islam, Judaism and Christianity — the traditional patriarchal era is placed in the Middle Bronze Age (~2000 BCE).",
    deep: [
      "God's covenant sounds like ancient Near-East royal treaties — a 'grant' covenant promising land and descendants.",
      "The Akedah (Genesis 22, the binding of Isaac) is central to Jewish liturgy and Christian theology alike.",
      "Circumcision (Genesis 17) is the sign of the covenant. Scholars debate how and when it became standard.",
      "Archaeology gives clues about the era (Mari tablets, Ur excavations) but no direct evidence of Abraham.",
    ],
  },
  {
    title: "Hammurabi's Code",
    yearsAgo: 3776,
    era: "World Powers",
    kid: "King Hammurabi of Babylon carved 282 laws onto a tall black stone pillar so every citizen could see the rules: if you break a bone, your bone is broken; an eye for an eye. Babylon became a superpower of trade, maths and astronomy!",
    fun: "'An eye for an eye' was written into law ~3,700 years before social media existed.",
    summary: "Hammurabi (ruled 1792–1750 BCE) built Babylon's first empire in Mesopotamia and published the Code of Hammurabi - one of the world's earliest full legal systems. Babylon then became the era's capital of astronomy, mathematics and literature.",
    deep: [
      "The stele (now in the Louvre) shows Hammurabi receiving the laws from Shamash, the sun god - divine endorsement as legitimacy.",
      "282 laws cover wages, trade, family law, fraud and injury; the penalty scales with your social class (free/commoner/slave).",
      "Babylonian base-60 counting survives every time you read the minutes on a clock.",
      "Scribes kept star records on clay for centuries - knowledge that Greek, Persian and Islamic astronomy inherited.",
    ],
  },
  {
    title: "The Alphabet",
    yearsAgo: 3400,
    era: "Civilization",
    kid: "Someone had an idea: instead of hundreds of picture-symbols, why not have just a few letters that stand for sounds? The alphabet was born - a shortcut that made reading and writing available to many more people!",
    fun: "Our alphabet was invented roughly once, and every A-to-Z letters in European languages descend from those Phoenician roots.",
    summary: "Around 1400-1050 BCE, traders and scribes in Egypt and the Levant compressed complex syllabic and word-sign systems into one-sign-per-sound letters. The idea spread through Phoenician traders to the Greeks, who added vowels - and gave Europe its A-to-Z.",
    deep: [
      "The Greek addition of vowels (a, e, i, o, u) completed the full 'phonetic alphabet' idea.",
      "The order A-B-C descends from Phoenician aleph-beth-gimel... — sound-content ordering conveyed meaning.",
      "Latin alphabet via Etruscan; Arabic, Hebrew and Devanagari scripts are also distant alphabet/syllabary cousins.",
      "Simplified scripts correlate with higher adult literacy in pre-modern states.",
    ],
  },
  {
    title: "Exodus & Mount Sinai",
    yearsAgo: 3300,
    era: "Biblical",
    kid: "The book of Exodus tells how Moses stood up to Pharaoh, said 'Let my people go', and led the Israelites out of Egypt. On Mount Sinai they received the Ten Commandments - ten rules to live by that still shape laws today!",
    fun: "Passover is Judaism's most-celebrated festival: the Exodus has been retold at family tables for over 3,000 years.",
    summary: "Exodus narrates Israel's slavery in Egypt, the ten plagues, the Passover night, the crossing of the sea, and the giving of the Law at Sinai. Dating: ~1310 BCE by Jewish tradition, ~1250 BCE in scholarly estimates under Ramesses II.",
    deep: [
      "The Merneptah Stele (~1208 BCE) is the first Egyption record naming 'Israel' — already in Canaan by then.",
      "The Sinai covenant's structure parallels Hittite suzerainty treaties — law + relationship in one agreement.",
      "Historicity is debated: there is no direct Egyptian record of the Exodus.",
      "Passover's Seder is an education device: the youngest child asks 'why is this night different?' — Exodus 13 commands that dialogue.",
    ],
  },
  {
    title: "King David Reigns",
    yearsAgo: 3000,
    era: "Biblical",
    kid: "The shepherd boy who fought the giant Goliath with a sling and a stone later became the most famous king of Israel - warrior, poet, and the ancestor whose royal family tree was promised to last forever!",
    fun: "The Tel Dan inscription (9th century BCE) is history's first outside mention of the 'House of David'.",
    summary: "David unites the tribes, captures Jerusalem and makes it his capital; 2 Samuel 7 establishes the Davidic covenant; the Psalter attributes many psalms to him. Archaeology includes the Tel Dan stele and a 10th-century BCE large-stone structure debated as his palace.",
    deep: [
      "Goliath's height: six cubits and a span (~2.9 m) in the Hebrew text; ~2 m in the Greek Septuagint.",
      "Slingers were real specialist troops; a stone at ~30 m/s could shatter a helmet — David's battle choice was skilful, not selfless courage.",
      "73 of the 150 Psalms carry David's name in their superscriptions.",
      "Eilat Mazar's 2005 excavation of a 'Large Stone Structure' dates to the 10th century BCE — identifications debated.",
    ],
  },
  {
    title: "Solomon's Temple",
    yearsAgo: 2960,
    era: "Biblical",
    kid: "King Solomon built the First Temple in Jerusalem - God's house - with cedar wood from Lebanon, gold everywhere you looked, and two giant bronze pillars called Jachin and Boaz. It stood for almost 400 years!",
    fun: "The Temple Mount is still Judaism's holiest site today - and home to the Dome of the Rock mosque.",
    summary: "1 Kings 6 dates the First Temple to ~966 BCE: cedar panelled, gold adorned, housing the Ark of the Covenant — the centre of Israel's worship until the Babylonian destruction of 586 BCE.",
    deep: [
      "1 Kings 6:1 cross-dates construction 480 years after the Exodus — around 966 BCE, with seven years of building.",
      "Phoenician partnership: Hiram of Tyre supplied cedar, craftsmen and logistics.",
      "The floor plan matches the 'long-room' designs of provincial Syrian temples known from archaeology.",
      "The Holy of Holies held the Ark. The high priest entered once a year, on Yom Kippur.",
    ],
  },
  {
    title: "The Neo-Assyrian Empire",
    yearsAgo: 2695,
    era: "World Powers",
    kid: "The Assyrians built the biggest empire the ancient world had ever seen - chariot armies, siege engineers who could crack any wall, and royal roads with express riders. Kings swept from Iran all the way to Egypt!",
    fun: "Assyria's king, Ashurbanipal, collected ~30,000 clay tablets - history's first real library.",
    summary: "The Neo-Assyrian Empire (911-609 BCE) pioneered professional armies, siege warfare, provincial governors and roads - ruling the Near East from Iran to Egypt. Its empire fell quickly (609 BCE) but its model of empire filled the gap Persia, Rome and others copied.",
    deep: [
      "Relay roads with stations let royal messages move faster than any rival's.",
      "The Library of Ashurbanipal (~30,000 tablets, Nineveh) is where the Epic of Gilgamesh was rediscovered - the world's oldest surviving great literature.",
      "Assyria's palace reliefs are war propaganda in stone - designed to awe visitors.",
      "Over-extension: a death spiral of revolt (Babylon's uprising) toppled it in just decades.",
    ],
  },
  {
    title: "The Babylonian Exile",
    yearsAgo: 2600,
    era: "Biblical",
    kid: "Babylon's army destroyed Jerusalem and the Temple in 586 BCE and marched the people far away to a foreign land. Instead of disappearing, the exiles kept the Sabbath, learned their scriptures by heart, and invented the synagogue - the Jewish people survived!",
    fun: "'By the rivers of Babylon...' — Psalm 137 is still sung in reggae, classical concerts and synagogues.",
    summary: "Nebuchadnezzar II took Jerusalem in 597 and razed it in 586 BCE (the First Temple's end). The exiles in Babylon rewrote the story: compilation and editing of the Hebrew Bible, synagogue gatherings and the belief that faith survives without a temple.",
    deep: [
      "The Babylonian Chronicles record Jerusalem's 597 BCE capture — external confirmation rare in that era.",
      "The Lachish letters and Babylonian reliefs depict the last stand of Judah's cities.",
      "The 'Documentary hypothesis' places much Torah-arrangement work in Exilic and post-Exilic scribal circles.",
      "Cyrus's decree (539 BCE) permitted return; many stayed — the diaspora began.",
    ],
  },
  {
    title: "Darius & the Persian Empire",
    yearsAgo: 2548,
    era: "World Powers",
    kid: "The Persian Empire under Darius was the largest the world had ever seen - from Greece to India! He split it into provinces with governors, built a 2,700 km Royal Road for express messages, and let every land keep its own gods and customs.",
    fun: "The Royal Road covered 2,700 km - and the ancient Greek word 'pony express' barely exaggerates.",
    summary: "Cyrus the Great and Darius I built the Achaemenid Empire - the largest the world had known, spanning three continents with satrap provinces, standard coinage (the daric), a Royal Road with relay stations and a post system, and a famously tolerant policy toward local religions.",
    deep: [
      "The Behistun Inscription (cliff-face autobiography, ~520 BCE) is also the Rosetta Stone of cuneiform - by copying one text in three languages it let scholars decode Mesopotamia's dead scripts.",
      "The satrap system became a template for Rome, later Islamic empires and modern federalism.",
      "Standard daric gold coins let trade run 4,000 km - the ancient world's most trusted currency.",
      "The Persian Wars against Greek city-states (490-479 BCE) shaped west-Asian and European history for millennia.",
    ],
  },
  {
    title: "The Return & Second Temple",
    yearsAgo: 2516,
    era: "Biblical",
    kid: "Persian King Cyrus let the exiles go home. They rebuilt the Temple - smaller than Solomon's, and the old-timers cried remembering the original! But it stood for another five centuries, and the city walls rose again under Nehemiah's watch.",
    fun: "Cyrus the Great is the one non-Jewish ruler the Hebrew Bible calls God's 'anointed king' (Isaiah 45:1).",
    summary: "Cyrus conquered Babylon in 539 BCE and allowed the exiles to return; a modest Second Temple was completed in 516 BCE. Ezra and Nehemiah rebuilt the community, made Torah-reading central — this Second-Temple era lasts until 70 CE.",
    deep: [
      "The Cyrus Cylinder (~539 BCE) records Babylon's surrender and a policy of restoring exiled peoples.",
      "Haggai and Zechariah chronicle the stalled rebuild and its completion under Darius I (516 BCE).",
      "The Western Wall is a retaining wall of Herod's later expansion of the same Temple Mount.",
      "Synagogue + Torah study + covenant replaced animal sacrifice as the diaspora's centre of gravity.",
    ],
  },
  {
    title: "Democracy is Born",
    yearsAgo: 2500,
    era: "Civilization",
    kid: "In the Greek city of Athens, citizens started voting directly on the city's big decisions in the town square - a radical idea called democracy: 'people power'. Heated argument, lot-drawing, and lots of loud opinions!",
    fun: "'Idiot' originally meant someone who chose not to vote in public life.",
    summary: "In 508 BCE, Athens reformed its constitution under Cleisthenes into a direct democracy: male citizens voted in the assembly and were chosen by lot for yearly offices. Terms like isonomia (equal laws) and parrhesia (free speech) come from this experiment.",
    deep: [
      "The courts, not the assembly, spent most Athenians' time — ~6,000 jurors for major trials.",
      "Equality stopped at the boundary: women, slaves and resident foreigners were excluded (~85% of residents).",
      "Rome later built a republic of representatives instead — a hybrid often copied by newer democracies.",
      "Athenian ostracism banished a politician for 10 years if 6,000 voters scratched his name on a potsherd.",
    ],
  },
  {
    title: "Alexander the Great",
    yearsAgo: 2356,
    era: "World Powers",
    kid: "A 20-year-old Macedonian prince inherited his father's brilliant army and took it across the known world - crushing the Persian superpower within 10 years, marching all the way to India. He died at 32, and his generals split the map!",
    fun: "Around a dozen cities were reborn or founded as 'Alexandria' - the Egyptian one had the ancient world's greatest library.",
    summary: "Alexander III of Macedon (336-323 BCE) brought down the Persian empire, marched east to the Indus and seeded a Greek-speaking world from Egypt to India (the 'Hellenistic age'). His generals split it into great dynasties, but Greek language, learning and trade networks outlived the empire.",
    deep: [
      "The Battle of Gaugamela (331 BCE) — outnumbered twice or more against Darius III; cavalry wedge tactics are still taught in military academies.",
      "The Library of Alexandria (founded by his general Ptolemy) collected hundreds of thousands of scrolls — the ancient world's research capital.",
      "Greek 'koine' became the Mediterranean lingua franca — the language in which the New Testament spreads.",
      "He never lost a set-piece battle in ten years; fever, wine or poison ended him at 32.",
    ],
  },
  {
    title: "Roman Empire",
    yearsAgo: 2_053,
    era: "Civilization",
    kid: "Rome grew from a small town into the most powerful empire in the western world — with roads you can still walk on today, heated baths, and a giant army with legions almost everywhere!",
    fun: "The Romans built over 400,000 km of roads — you could walk from Scotland to Iraq on Roman paving.",
    summary: "Rome becomes an empire, spreading law, engineering, administration and culture across Europe, North Africa and the Middle East. Its legacy still shapes Western law, language and infrastructure.",
    deep: [
      "Augustus becomes the first emperor (27 BCE) after a century of civil war; the 'Pax Romana' lasts ~200 years.",
      "At its height under Trajan the empire covers ~5 million km² and holds maybe a quarter of the world's population.",
      "Roman concrete (pozzolanic ash) self-heals in seawater — modern studies show crystals growing in cracks, which is why harbour piers survive.",
      "Infrastructure: ~80,000 km paved roads, aqueducts like the Pont du Gard, and a professional standing army of ~30 legions.",
      "Latin's descendants (Romance languages) and Roman law's concepts (code, precedent via jurists) are structural parts of modern Europe.",
    ],
  },
  {
    title: "The Birth of Jesus",
    yearsAgo: 2030,
    era: "Biblical",
    kid: "In a stable in Bethlehem, a baby was born to Mary and Joseph - Jesus, called the Christ. Shepherds heard angels singing, wise men followed a star, and Christmas now celebrates this night in almost every country on Earth!",
    fun: "December 25 was chosen as Christmas about 300 years after the events; early Christians celebrated his birth in spring.",
    summary: "The Gospels place Jesus' birth in Bethlehem during Herod the Great's reign. The BC/AD calendar was recomputed in 525 CE by Dionysius Exiguus, offset by later discoveries: Herod died in 4 BCE, so Jesus is now dated 6-4 BCE.",
    deep: [
      "Matthew tells of Herod and the flight to Egypt; Luke tells of a manger, shepherds and a census — they harmonise imperfectly (the census was under Quirinius, 6 CE).",
      "The Gregorian calendar AD scheme stems from Dionysius Exiguus, who computed the Incarnation year from scripture alone — an under-count by ~4-6 years.",
      "Non-Christian sources (Tacitus, Josephus, Pliny) confirm Jesus existed and was crucified — the birth narratives are faith texts.",
      "The Star of Bethlehem theories include a Jupiter-Saturn conjunction (7 BCE) or a literary motif (Numbers 24:17's star out of Jacob).",
    ],
  },
  {
    title: "The Crucifixion & Resurrection",
    yearsAgo: 1996,
    era: "Biblical",
    kid: "Jesus was arrested, put on trial and executed on a wooden cross at a hill called Golgotha outside Jerusalem. His followers announced that he rose from the dead on the third day - and that announcement changed the world!",
    fun: "Easter's date moves every year because it is calculated from the Jewish Passover's full moon.",
    summary: "Jesus was crucified under Pontius Pilate (~30-33 CE). Followers proclaimed his resurrection; within decades the movement had communities across the Roman empire and a written New Testament. Easter, celebrating resurrection, became Christianity's central feast.",
    deep: [
      "Tacitus (Annals 15.44) confirms the execution 'in the reign of Tiberius, under the procurator Pontius Pilate'.",
      "Archaeology matches: a first-century crucified man's heel bone (Yehohanan) was found at Giv'at ha-Mivtar, Jerusalem, 1968.",
      "Resurrection claims, not Jesus' existence, are the debated historical core - viewpoints span historic orthodoxy to mythicism.",
      "Easter's dating: Nisan 14 vs 15 dispute made John's and the Synoptic gospels' timelines differ.",
    ],
  },
  {
    title: "The Second Temple Falls",
    yearsAgo: 1956,
    era: "Biblical",
    kid: "In the year 70 CE, Roman armies burned Jerusalem and destroyed the Second Temple - the last heart of ancient Judaism. The Western Wall survives today, and Judaism reshaped itself around synagogues, Torah study and prayer — the faith outlived the building!",
    fun: "The Arch of Titus in Rome shows soldiers carrying the Temple's menorah - carved 1,900 years ago.",
    summary: "Rome crushed the Great Jewish Revolt in 70 CE; Titus destroyed the Second Temple. The aftermath: rabbinic Judaism rebuilt itself around Torah study and synagogues (Yavneh academy), and a diaspora spread through both Roman and Persian worlds.",
    deep: [
      "The Arch of Titus (81 CE) relief scene shows the seven-branched menorah entering Rome as spoils.",
      "Josephus' 'The Jewish War' is the eye-witness history for this entire siege.",
      "Rabbinic academies at Yavneh replaced the temple: the Mishnah emerges ~200 CE.",
      "Masada's 73 CE siege (966 defenders) closed the revolt; archaeology confirms much of the classical account.",
    ],
  },
  {
    title: "Fall of Rome / Middle Ages",
    yearsAgo: 1_548,
    era: "Civilization",
    kid: "The giant Roman empire got too big and started falling apart into pieces. In the lands where Rome once ruled, new kingdoms grew up, brave knights rode around, and monks in monasteries copied out the old books by hand!",
    fun: "The eastern half (Byzantium) kept going for another 1,000 years — its capital, Constantinople, was the biggest and wealthiest city in Europe.",
    summary: "The Western Roman Empire collapses in 476 CE and Europe fragments into competing kingdoms, beginning the medieval period. Learning is preserved in monasteries, and in the Islamic world, mathematics, medicine and philosophy flourish and are later re-imported to Europe.",
    deep: [
      "476 CE: the barbarian general Odoacer deposes Romulus Augustulus; the east continues as Byzantium for another millennium.",
      "The Islamic Golden Age (~8th–13th c., House of Wisdom in Baghdad) preserves and extends Greek science; algebra and 'algorithm' come from al-Khwarizmi.",
      "Black Death (1347–51) kills 30–60% of Europe, reshaping labour, religion and economics during the Late Middle Ages.",
      "Cathedral engineering (flying buttresses, ribbed vaults) lets stone rise higher than any earlier civilisation managed in Europe.",
    ],
  },
  {
    title: "The Caliphates Spread",
    yearsAgo: 1356,
    era: "World Powers",
    kid: "After Muhammad's death, Arab armies spread from Mecca across the Middle East, North Africa and Spain — building a new superpower with one language of law and learning (Arabic), new coins, and courts that sat across three continents!",
    fun: "The caliphate's gold dinar circulated from Spain to Afghanistan — centuries of stable trade currency.",
    summary: "The Rashidun and Umayyad caliphates (632–750 CE) conquered an arc from Spain to Central Asia in roughly a century. Shared law, coinage and language created a civilisational superpower whose trade and learning networks made the Islamic Golden Age possible.",
    deep: [
      "Umayyad Córdoba was the largest city in Western Europe — with street lighting, libraries and the region's best hospitals.",
      "The Battle of Talas (751 CE) brought Chinese paper-making west through the caliphate — books became cheap.",
      "Arabic became the language of science, trade and law across three continents — the Mediterranean's 'Lingua Franca'.",
      "The caliphs' post system (barid) with relay stations was copied by later empires.",
    ],
  },
  {
    title: "The Islamic Golden Age",
    yearsAgo: 1200,
    era: "Civilization",
    kid: "In cities like Baghdad and Cordoba, scholars translated the best ideas from Greece, Persia and India into Arabic - and then added tons of their own! They invented algebra, hospitals and huge libraries, and taught Europe later.",
    fun: "'Algebra' comes from the Arabic 'al-jabr' — a book title written by the mathematician al-Khwarizmi; 'algorithm' comes from his name.",
    summary: "From the 8th to 13th centuries, the Islamic world became the global centre of knowledge: the House of Wisdom translated and built upon Greek, Persian and Indian science. Advances in mathematics, astronomy, medicine, optics and chemistry shaped the modern world.",
    deep: [
      "Al-Khwarizmi's book gave us algebra and his name gave us 'algorithm'.",
      "Ibn al-Haytham's Book of Optics (1011-1021 CE) founded experimental physics method centuries before Europe.",
      "Translation movement: Greek philosophy and science survived where it had vanished in the West — via Arabic copies.",
      "Hospitals (bimaristan) were founded with wards, medical records and teaching medical rounds — the modern hospital template.",
    ],
  },
  {
    title: "The Mongol Empire",
    yearsAgo: 820,
    era: "World Powers",
    kid: "Genghis Khan and his sons built the biggest land empire in history — on horseback! From Korea to Hungary, one ruling family governed a huge chunk of the planet. And they made the Silk Road safe to travel, connecting East and West.",
    fun: "The Mongol horse-relay network let a message travel 300 km in a day — ancient broadband.",
    summary: "From 1206 CE the Mongols created the largest contiguous land empire in history — China, Central Asia, Persia and Russia. The 'Pax Mongolica' made the Silk Road safe for a century, moving paper, gunpowder, astronomy, plague and Marco Polo between continents.",
    deep: [
      "The Yam relay network (~40 km spacing) gave royal messengers the ancient world's fastest courier service.",
      "The empire's law code (the Yassa) enforced religious tolerance and stuff merit promotion — rare for its time.",
      "The Black Death travelled along the very trade routes the Mongols kept open — connectivity cut both ways.",
      "Marco Polo told the West about Kublai Khan's empire: the most copied travel book of the Middle Ages.",
    ],
  },
  {
    title: "Printing Press",
    yearsAgo: 584,
    era: "Modern",
    kid: "A German inventor figured out how to make identical metal letters, then stamp them onto paper hundreds of times. Suddenly, instead of one handwritten book, you could have a thousand printed ones. Ideas could finally run around the world!",
    fun: "Before printing, a copy of the Bible took a monk about a year to write out. After Gutenberg, a workshop could print hundreds in a year.",
    summary: "Johannes Gutenberg's movable-type printing press makes books cheap and abundant, kicking off an information revolution that accelerates the Reformation, the Scientific Revolution and mass literacy.",
    deep: [
      "Combines movable metal type, oil-based ink, the screw press and affordable paper — the system, not just the invention, matters.",
      "Print runs made identical copies, enabling standardised texts, cross-references and (via errors) the modern notion of errata and scientific citation.",
      "Martin Luther's 95 Theses spread across Europe within weeks — an effect impossible with hand-copying — driving the Reformation.",
      "Vernacular printing broke Latin's monopoly on learning, pushing literacy and national languages; book prices collapsed by orders of magnitude.",
    ],
  },
  {
    title: "Two Worlds Collide",
    yearsAgo: 530,
    era: "Modern",
    kid: "In 1492, ships under Columbus reached islands in the Caribbean. Two halves of the world that had been separated for maybe 15,000 years were suddenly connected again - bringing food, ideas... and epidemics. The world got a lot bigger — and a lot closer — at once!",
    fun: "Half the plants in your kitchen today might not be native to your continent at all - potatoes, chocolate, tomatoes all crossed 'the pond'.",
    summary: "After 1492, the Americas and Afro-Eurasia reconnected after ~15,000 years. The 'Columbian exchange' of crops, animals, people - and pathogens - transformed global agriculture and demography. It's one of history's clearest dividing lines: before and after.",
    deep: [
      "Potatoes, maize, tomatoes and chocolate came from the Americas; horses, wheat and smallpox went the other way.",
      "Indigenous American populations fell by up to 90% in a century from disease, war and displacement.",
      "Within 200 years the new calorie sources (potato, maize) powered population booms in Europe and Asia.",
      "Global trade networks crossed the globe and eventually opened the Pacific too (Magellan's crew, 1519-22).",
    ],
  },
  {
    title: "Newton Rewrites the Sky",
    yearsAgo: 339,
    era: "Modern",
    kid: "In 1687, Isaac Newton published a book showing that the same force that makes apples fall also keeps the Moon in orbit. One law for the whole universe - a giant leap in how humans understood reality!",
    fun: "Newton invented calculus partly to write this book - he described the universe in the language of continuous change.",
    summary: "Newton's Principia (1687) uses mathematics to unify terrestrial and celestial physics: one set of laws governs falling apples and orbiting moons. It marks a pivot where science becomes 'laws, tested by prediction', and the universe begins reading as a machine we can decode.",
    deep: [
      "Edmond Halley pushed Newton to publish Principia — and even paid for printing.",
      "Newton's laws let Halley predict his comet's return in 1758, 16 years after his death.",
      "The 'Newtonian revolution' also changed philosophy: a mechanical universe, readable through mathematical experiment.",
      "Einstein later showed Newton's laws are a very good approximation of deeper relativity — they still keep satellites on task.",
    ],
  },
  {
    title: "Industrial Revolution",
    yearsAgo: 264,
    era: "Modern",
    kid: "People started building clever machines that could do the work of dozens of workers — giant spinning machines, puffing steam engines and smokestack factories. Cities ballooned, trains chugged across countries, and everything changed!",
    fun: "For thousands of years the fastest speed on land was a galloping horse. Trains suddenly made 100 km/h a normal Tuesday.",
    summary: "Steam power, factories, mechanization and coal transform economies, cities and daily life worldwide. It launches the modern economy and its trade-offs: growth, pollution and inequality.",
    deep: [
      "Starts in Britain ~1760; key inputs: improved Newcomen and Watt steam engines, coke-smelted iron, cotton textiles, canals.",
      "Economic 'hockey stick': sustained per-capita GDP growth is essentially absent for millennia before showing up with industrialisation.",
      "Urbanization: Manchester grows from ~25,000 (1772) to over 300,000 by 1850, with accompanying public health crises and reform.",
      "Second Industrial Revolution (steel, electricity, chemicals) follows; with it, the modern research lab and corporate R&D appear.",
    ],
  },
  {
    title: "Vaccines Discovered",
    yearsAgo: 230,
    era: "Modern",
    kid: "In 1796, a doctor named Edward Jenner noticed that milkmaids who caught a mild cow disease never caught the terrible smallpox. He tried a daring experiment - and invented vaccination, saving hundreds of millions of lives since!",
    fun: "The word 'vaccine' comes from 'vacca', Latin for cow - all vaccinations are named after a cow disease.",
    summary: "In 1796, Edward Jenner used cowpox to immunise against smallpox, the world's deadliest disease at the time. This built on people 'variolating' themselves deliberately for centuries across Asia and Africa; Jenner's move showed why it worked: training the immune system with a safe cousin virus.",
    deep: [
      "Smallpox may have killed ~300 million people in the 20th century alone; WHO declared it eradicated in 1980.",
      "Jenner tested on an 8-year-old boy, James Phipps — and then exposed him to smallpox (whoa).",
      "Vaccination later erased polio from the Americas, Africa and much of Asia — and put a stop to measles in the rich world by 1990s.",
      "Pasteur's later work (rabies, 1885) generalised vaccine science beyond smallpox.",
    ],
  },
  {
    title: "Electricity Lights Up the World",
    yearsAgo: 150,
    era: "Modern",
    kid: "In the 1870s-90s, inventors and companies raced to turn electricity into light and power. Suddenly cities glowed at night, machines ran day and night, and the modern electric world switched on!",
    fun: "The first electric street in the world was a stretch of road in Cleveland, Ohio, lit by 'arc lamps' in 1879.",
    summary: "Between the 1870s and 1890s, arc lamps, dynamos, transformers and Stephen and Tesla's alternating-current battles turned electricity from a parlour trick into infrastructure. Cities lit up at night; factories ran on motors; and the second industrial revolution ran on electrons.",
    deep: [
      "Edison's Pearl Street Station (1882, New York) served 59 customers — the first commercial grid.",
      "The 'War of the Currents' (Edison DC vs Westinghouse/Tesla AC) was fought with fearmongering and electrocuted elephants.",
      "Faraday's 1831 discovery of induction was the seed; transformers made long-distance transmission practical.",
      "Home electricity went from 0% to nearly universal in the industrialized world within two generations.",
    ],
  },
  {
    title: "First Powered Flight",
    yearsAgo: 121,
    era: "Modern",
    kid: "Two brothers who ran a bicycle shop in Ohio built a machine with wings and a tiny engine. On a windy beach in North Carolina, it lifted off the ground and flew for 12 whole seconds — and before long, everyone followed!",
    fun: "The first plane flew slower than a modern racing bicycle races. Sixty-six years later, we landed on the Moon.",
    summary: "Orville and Wilbur Wright achieve the first controlled, powered, sustained flight in Kitty Hawk, North Carolina — the start of practical aviation.",
    deep: [
      "December 17, 1903 — the Flyer's first hop covers 37 m in 12 s; a later run the same day manages 260 m.",
      "Key insight was control, not power: three-axis control (roll via wing warping, yaw via rudder, pitch via elevator) made flight practical.",
      "The Wrights built their own wind tunnel and tested hundreds of mini wing sections to nail lift and drag — an early triumph of experimental engineering.",
      "Within a decade aircraft fight in WWI; within three decades, commercial aviation spans the Atlantic and transport times shrink by orders of magnitude.",
    ],
  },
  {
    title: "The British Empire",
    yearsAgo: 106,
    era: "World Powers",
    kid: "By 1920, a small island nation ruled a quarter of the world's land and people — 'the empire on which the sun never sets', from Canada to Australia. Its English language, laws and railways still shape the world — along with its colonial debts and debates!",
    fun: "The empire's population in 1920 was about 412 million — roughly a quarter of humanity.",
    summary: "The British Empire (~35.5 million km² at peak, 1920) was the largest empire in history, built on naval power, industry and trade — and on conquest and worker exploitation. English, parliamentary rule and cricket spread worldwide; the fight for independence (from 1947 onwards) redrew the map.",
    deep: [
      "'The empire on which the sun never sets' — a claim first made about the Spanish empire, reused for Britain.",
      "English, once a regional language, now counts ~1.5 billion speakers.",
      "The 1947 Indian independence linked to a global decolonisation wave across the next ~30 years.",
      "The pounding sterling was the world's reserve currency until WWII; the US dollar took over.",
    ],
  },
  {
    title: "Antibiotics Discovered",
    yearsAgo: 100,
    era: "Modern",
    kid: "In 1928, Alexander Fleming came back from holiday and found a strange mould had sneaked into his lab. It had wiped out the bacteria around it! That mould became penicillin - the first antibiotic - and it has saved more human lives than almost anything else.",
    fun: "It took ~15 years and a world war (burn wounds + infection) to turn Fleming's mould into mass-producible medicine.",
    summary: "In 1928, Alexander Fleming noticed a Penicillium mould killing bacteria in one of his dishes. A decade later Florey and Chain turned it into purified medicine; mass production in WWII opened the antibiotic era, letting surgeons cut safely and infections become curable.",
    deep: [
      "Fleming, Florey and Chain shared the Nobel Prize; Fleming famously warned about misuse creating resistance.",
      "'Antibiotic' means 'against life' (antibiotic = Greek: against-life); the first true mass-market medicine 'Prontosil' was a dye.",
      "Antibiotic-resistant bacteria now kill ~1.27 million people per year directly (2022 estimate).",
      "Antibiotics unlocked deep surgery, transplants and chemotherapy — all depend on infection control.",
    ],
  },
  {
    title: "The World Wars",
    yearsAgo: 86,
    era: "World Powers",
    kid: "Between 1914 and 1945, two world wars killed something like 100 million people, using planes, tanks and finally atomic bombs. The end of WWII brought the United Nations, new borders, new superpowers — and a promise to try to build peace together!",
    fun: "The first 'computer' (Colossus) was built to crack encrypted Nazi messages — a war invention.",
    summary: "Two global wars (1914-18 and 1939-45) killed ~100 million. The old empires (Ottoman, Austro-Hungarian, German, Russian) collapsed and the map was redrawn. WWII ended with the atomic bomb — and the founding of the UN, NATO, the welfare state and the postwar order.",
    deep: [
      "The 1918 influenza pandemic killed more people than the war itself (~50M).",
      "The Treaty of Versailles' heavy reparations fed the rise of extremist politics in Germany.",
      "The Holocaust murdered six million Jews, plus millions of Roma and others.",
      "Wartime science produced radar, jets, nuclear power and the first electronic computers.",
    ],
  },
  {
    title: "The Transistor",
    yearsAgo: 79,
    era: "Modern",
    kid: "In 1947, three scientists at Bell Labs built a tiny gadget that could switch an electric signal with no moving parts - the transistor. It replaced hot, fragile vacuum tubes and became the speck-sized heart of every computer, phone and robot in the world!",
    fun: "A modern phone chip contains tens of billions of transistors; the first one was the size of a pencil eraser.",
    summary: "In December 1947, Bardeen, Brattain and Shockley at Bell Labs demonstrated the point-contact transistor, a semiconductor amplifier that replaced bulky, hot vacuum tubes. Miniaturised into chips, it enabled the information age: computers, smartphones, satellite navigation and eventually everything digital.",
    deep: [
      "The three inventors shared the 1956 Nobel Prize in Physics.",
      "Moore's Law: transistor counts on chips double roughly every two years — an exponential that defined the digital era.",
      "Transistors are switches: on/off logic gates are built from clusters of them; billions fit on a pencil-tip chip.",
      "The internet, GPS, modern cars and our phones all reduce to combinations of transistors switching on and off.",
    ],
  },
  {
    title: "The DNA Double Helix",
    yearsAgo: 73,
    era: "Modern",
    kid: "In 1953, Watson, Crick and their colleagues revealed that DNA is a twisting ladder - and the rungs spell out instructions written in a 4-letter alphabet. Suddenly, heredity had a language that scientists could read, copy and (eventually) edit!",
    fun: "Rosalind Franklin's X-ray photo 'Photo 51' was the crucial clue - and she never got full credit in her lifetime.",
    summary: "In 1953, James Watson, Francis Crick, Rosalind Franklin and Maurice Wilkins worked out that DNA is a double helix whose base pairs form a code. Decoding genetics — in the decades since — led to DNA fingerprinting, gene therapy, CRISPR, mRNA vaccines and genome medicine.",
    deep: [
      "A single human cell holds ~2 metres of DNA in a nucleus millionths of a metre wide.",
      "'Central dogma' insight: DNA → RNA → protein — how 4 letters build 20 amino acids and 30,000 genes.",
      "Human genome sequencing took 13 years and ~$3B in 2003; today it costs under $500.",
      "CRISPR (2012) turned decades of work into a do-it-yourself gene-editing tool — 2020 Nobel Prize.",
    ],
  },
  {
    title: "The Cold War",
    yearsAgo: 70,
    era: "World Powers",
    kid: "After WWII, two superpowers - the capitalist United States and the communist Soviet Union - pointed atom bombs at each other but never fought head-on. They raced to space, pumped money into science and spies, and shaped politics on every continent for 45 years!",
    fun: "The famous 'red phone' hotline was actually a teleprinter line, not a phone — and it mostly sat silent.",
    summary: "From ~1947 to 1991 the US and USSR blocs competed through deterrence, the space race, proxy wars (Korea, Vietnam, Afghanistan) and influence campaigns. The Soviet collapse in 1991 left the US as the sole superpower — with today's multi-polar competition the next chapter.",
    deep: [
      "Mutually Assured Destruction (MAD) meant both sides' arsenals could end civilisation — the Cuban Missile Crisis (1962) came closest to tipping.",
      "The space race (Sputnik 1957, Gagarin 1961, Apollo 1969) turned rocketry into prestige technology.",
      "ARPANET — the internet's ancestor — was built in this era's DARPA research push.",
      "The USSR's collapse in 1991 left both nuclear arsenals intact and the Russian Federation as its successor.",
    ],
  },
  {
    title: "Moon Landing",
    yearsAgo: 55,
    era: "Modern",
    kid: "Two astronauts rode a rocket taller than a football field, left Earth completely, and walked on the Moon! Their friend Michael Collins stayed in orbit above them. Back on Earth, half a billion people watched on TV.",
    fun: "The Moon still has the astronauts' footprints, because there's no wind to blow them away. Only the flags may have faded in the sun.",
    summary: "NASA's Apollo 11 lands the first humans on the Moon — Neil Armstrong and Buzz Aldrin — one of the peak moments of 20th-century exploration and diplomacy in space.",
    deep: [
      "July 20, 1969 UTC: Armstrong and Aldrin spend 21h 31m on the surface; Manual throttle issues nearly depleted fuel before touchdown (Armstrong had ~25 s spare).",
      "Saturn V produced ~7.6 million pounds of thrust and remains the most powerful rocket ever flown — a comparison point for today's SLS and Starship.",
      "Apollo returned 382 kg of lunar samples; isotopic similarity of Earth and Moon rocks remains key evidence for the giant-impact origin of the Moon.",
      "Laser retroreflectors left on the surface are still used to measure the Earth–Moon distance to millimetre precision.",
      "The programme is a case study in systems engineering, risk management and international prestige — and a foundation for today's Artemis partnership.",
    ],
  },
  {
    title: "Internet & World Wide Web",
    yearsAgo: 35,
    era: "Modern",
    kid: "Computers all over the world learned to talk to each other. Then a scientist at a physics lab in Switzerland invented a way to share pages of information with clickable links. Now you can look almost anything up from your pocket in a second!",
    fun: "The very first photo ever uploaded to the web was of a comedy band. Tim Berners-Lee's first website is still online.",
    summary: "The internet and the World Wide Web connect the globe, giving billions instant access to information, communication and commerce. It is this era's defining infrastructure, reshaping work, learning and society.",
    deep: [
      "ARPANET's first message (UCLA→SRI) on Oct 29, 1969 crashes two letters in; TCP/IP standard decreed 'flag day' Jan 1, 1983.",
      "Tim Berners-Lee proposes the Web (1989) and posts the first site (1991) at CERN; HTTP, HTML and URLs are deliberately simple and royalty-free.",
      "Packet-switching and decentralised routing make the net resilient by design — no central owner, no single point of failure (mostly).",
      "Roughly 5.5 billion people are now online; mobile-first access dominates, and the web is both a megaphone for science (preprints, open data) and a battleground for attention and disinformation.",
    ],
  },
  {
    title: "The Human Genome Mapped",
    yearsAgo: 25,
    era: "Modern",
    kid: "In the early 2000s, scientists finished reading our entire genetic instruction book — all 3 billion letters of it. Suddenly, we could compare our DNA with any creature's, find the genes behind diseases, and start reading our own biology!",
    fun: "Humans have ~20,000 genes — about the same as a mouse and fewer than a rice plant.",
    summary: "The Human Genome Project (1990-2003) read the full 3-billion-letter sequence of human DNA, an international effort. It created a reference genome (and taught us surprises: people differ from each other by maybe 0.1-0.5%, we have fewer genes than expected, and much of our DNA is 'dark matter').",
    deep: [
      "Sequencing cost fell from ~$3 billion to under $500 in 20 years — a 6-million-fold price drop.",
      "Your genome is ~99.9% the same as your neighbour's; the differences drive everything from blood type to hair curl.",
      "~8% of the human genome is ancient retrovirus DNA — historical infections stamped into our inheritance.",
      "Genome medicine (cancer typing, rare disease diagnosis) quietly became clinical practice in the 2010s.",
    ],
  },
  {
    title: "Smartphones Change Everything",
    yearsAgo: 19,
    era: "Modern",
    kid: "In 2007, the iPhone combined a phone, a pocket computer, a camera and the whole internet into one slab of glass. Within a decade, billions of people were carrying more computing power than the Apollo missions had!",
    fun: "Your phone is now more powerful than the best supercomputer on Earth in 1990.",
    summary: "With the iPhone (2007) and Android (2008), powerful internet-connected computers entered billions of pockets. ubicomp — maps, cameras, payments, translation, health tracking — became ambient. In under a decade humanity went from 'the web' to life lived in a continuous digital layer.",
    deep: [
      "Phones now vastly outnumber humans (we crossed ~6 billion smartphones in 2021).",
      "The camera + GPS + accelerometer data from phones quietly revolutionised mapping, transport and epidemiology.",
      "Twitter, Instagram, TikTok and a billion-dollar creator economy are phone-native inventions.",
      "The 'pocket supercomputer' also reshaped attention, news, advertising and politics — the trade-offs are still being worked out.",
    ],
  },
  {
    title: "The Modern Era",
    yearsAgo: 0,
    era: "Present",
    kid: "You're living in the fastest-changing time ever! Robot cars drive on Mars, doctors edit genes to fight diseases, computers can talk to you, and there are more than 8 billion people to share the planet with.",
    fun: "By the time you're an adult today, there may be people living and working on the Moon — just like the explorers of old.",
    summary: "Today — an interconnected world of 8 billion people, with smartphones, AI, renewable energy, and ongoing exploration of our own planet and the cosmos. We face global challenges and decisions that will shape what comes next.",
    deep: [
      "JWST observes galaxies whose light left over 13 billion years ago — looking back nearly to the beginning.",
      "Fusion ignition achieved (NIF, Dec 2022); commercial spaceflight and space-based assembly are opening new industrial paths.",
      "LIGO/Virgo detect gravitational waves from black hole mergers — a brand-new way to 'hear' the universe.",
      "Open questions: fusion economics, AI alignment, climate trajectories, biodiversity loss and how to become a multi-planet species without exporting our problems.",
    ],
  },
]

  /* -------------------------------------------------------------
     Palette: broad era families, one distinct shade per event.
     ------------------------------------------------------------- */
  const ERA_COLORS = {
    "Cosmic origins": "#a78bfa",
    "Galaxies": "#818cf8",
    "Solar System": "#fb923c",
    "Life": "#34d399",
    "Humans": "#f472b6",
    "Civilization": "#fbbf24",
    "Biblical": "#c084fc",
    "World Powers": "#ef4444",
    "Modern": "#38bdf8",
    "Present": "#f1f5f9",
  };

  function eraColor(era) {
    return ERA_COLORS[era] || "#38bdf8";
  }

  const ERA_HUES = {
    "Cosmic origins": 258,
    "Galaxies": 225,
    "Solar System": 30,
    "Life": 155,
    "Humans": 330,
    "Civilization": 42,
    "Biblical": 278,
    "World Powers": 0,
    "Modern": 195,
    "Present": 205,
  };

  const EVENT_COLORS = (() => {
    const totals = {};
    const counters = {};
    const hueUsed = {};
    MILESTONES.forEach((m) => {
      totals[m.era] = (totals[m.era] || 0) + 1;
    });
    return MILESTONES.map((m) => {
      const i = counters[m.era] ?? 0;
      counters[m.era] = i + 1;
      const base = ERA_HUES[m.era] ?? 200;
      const n = totals[m.era];
      const spread = n > 1 ? Math.min(14, 70 / n) : 0;
      const mid = (n - 1) / 2;
      let hue = (base + (i - mid) * spread + 360) % 360;
      const sat = m.era === "Present" ? 15 : 66;
      let light = m.era === "Present" ? 88 : 58;
      // guarantee global uniqueness: step lightness up when a hue band repeats
      let key = Math.round(hue) + "-" + Math.round(sat) + "-" + Math.round(light);
      while (hueUsed[key]) {
        light += 8;
        if (light > 92) { light = 42; hue = (hue + 3) % 360; }
        key = Math.round(hue) + "-" + Math.round(sat) + "-" + Math.round(light);
      }
      hueUsed[Math.round(hue) + "-" + Math.round(sat) + "-" + Math.round(light)] = true;
      return { h: Math.round(hue), s: sat, l: Math.round(light) };
    });
  })();

  function eventColor(i) {
    const c = EVENT_COLORS[((i % EVENT_COLORS.length) + EVENT_COLORS.length) % EVENT_COLORS.length];
    return "hsl(" + c.h + " " + c.s + "% " + c.l + "%)";
  }

  function eventColorAlpha(i, a) {
    const c = EVENT_COLORS[((i % EVENT_COLORS.length) + EVENT_COLORS.length) % EVENT_COLORS.length];
    return "hsl(" + c.h + " " + c.s + "% " + c.l + "% / " + a + ")";
  }

  /* -------------------------------------------------------------
     Scale positions (log). Pure: pass the event plus the view.
     ------------------------------------------------------------- */
  const MAX_YEARS = 13_800_000_000;
  const HUMAN_MAX = 12_000;

  function xPosition(yearsAgo) {
    const t = Math.log10(Math.max(0, yearsAgo) + 1) / Math.log10(MAX_YEARS + 1);
    return 1 - t;
  }

  function fracFor(yearsAgo, maxYears) {
    const max = maxYears == null ? MAX_YEARS : maxYears;
    if (yearsAgo > max) return null;
    const t = Math.log10(yearsAgo + 1) / Math.log10(max + 1);
    return 1 - t;
  }

  /* Readable and compact time expressions */
  /* Civilization view membership: the Biblical track keeps its own chronology */
  function visibleInCivilization(m) {
    return m.yearsAgo <= HUMAN_MAX && m.era !== "Biblical" && m.era !== "World Powers";
  }

  function formatTime(yearsAgo) {
    if (yearsAgo === 0) return "Present";
    if (yearsAgo < 1000) return yearsAgo + " years ago";
    if (yearsAgo < 1_000_000) return (yearsAgo / 1000).toLocaleString() + " thousand years ago";
    if (yearsAgo < 1_000_000_000) return (yearsAgo / 1_000_000).toLocaleString() + " million years ago";
    return (yearsAgo / 1_000_000_000).toLocaleString() + " billion years ago";
  }

  function formatShort(yearsAgo) {
    if (yearsAgo === 0) return "Present";
    if (yearsAgo >= 1e9) return (+(yearsAgo / 1e9).toPrecision(3)) + " Bya";
    if (yearsAgo >= 1e6) return (+(yearsAgo / 1e6).toPrecision(3)) + " Mya";
    if (yearsAgo >= 1e3) return (+(yearsAgo / 1e3).toPrecision(3)) + " kya";
    return yearsAgo + " ya";
  }

  /* -------------------------------------------------------------
     Tiered label layout. Given horizontal boxes, assign each a
     vertical tier so overlapping labels cascade upward instead
     of mixing into each other. Pure! Items are { x, w } in
     pixels; returns one tier per item, in the given order.
     ------------------------------------------------------------- */
  function assignTiers(items, gap) {
    const minGap = gap == null ? 8 : gap;
    const rows = [];
    const sorted = items
      .map((it, order) => ({ x: it.x, w: it.w, order }))
      .sort((a, b) => a.x - b.x);
    const tiers = new Array(items.length).fill(0);
    sorted.forEach((it) => {
      let t = 0;
      for (;;) {
        const row = rows[t] || (rows[t] = []);
        const clash = row.some(function (o) {
          return !(it.x + it.w + minGap < o.x || o.x + o.w + minGap < it.x);
        });
        if (!clash) break;
        t += 1;
        if (t > 6) break;
      }
      it.tier = Math.min(t, 7);
      (rows[it.tier] = rows[it.tier] || []).push(it);
    });
    sorted.forEach(function (it) { tiers[it.order] = it.tier; });
    return tiers;
  }

  /* -------------------------------------------------------------
     Era explainers — shown when you hover a legend chip.
     ------------------------------------------------------------- */
  const ERA_INFO = {
    "Cosmic origins": "The very first 400 million years: the Big Bang, the birth of atoms, and the ignition of the first stars in an otherwise dark universe.",
    "Galaxies": "Gravity gathers clouds of gas and stars into the great spinning islands we call galaxies — including our own Milky Way.",
    "Solar System": "The Sun switches on and leftover dust grows into planets, moons and comets. Our own Earth and Moon are formed here.",
    "Life": "From the first single cells fighting for survival to the explosion of complex animals, and the disasters that reset the board.",
    "Humans": "An African ape lineage learns to walk, grow big brains, speak, share ideas — and spread across the entire planet.",
    "Civilization": "Farming feeds the first villages, writing records them, and cities, empires and technologies snowball into history.",
    "Biblical": "The stories, laws, poems and histories recorded in the Hebrew Scriptures and the New Testament — placed here by their traditional and scholarly dates.",
    "World Powers": "The superpowers across time: Egypt, Assyria, Persia, the Greeks, the Caliphates, the Mongols, Britain, the World Wars and the Cold War — the states and empires whose reach reshaped global politics.",
    "Modern": "The last few centuries: industry, powered flight, space, computing — change arrives faster and faster.",
    "Present": "Where we live now: 8 billion people, one shared planet, more information than ever — and the future still unwritten.",
  };

  /* -------------------------------------------------------------
     Read-more sources: one trusted article per milestone.
     ------------------------------------------------------------- */
  const LEARN_MORE = {
    "The Big Bang": "https://en.wikipedia.org/wiki/Big_Bang",
    "First Stars Ignite": "https://en.wikipedia.org/wiki/Star_formation",
    "Milky Way Forms": "https://en.wikipedia.org/wiki/Milky_Way",
    "Solar System Forms": "https://en.wikipedia.org/wiki/Formation_and_evolution_of_the_Solar_System",
    "Earth Forms": "https://en.wikipedia.org/wiki/History_of_Earth",
    "First Life Appears": "https://en.wikipedia.org/wiki/Abiogenesis",
    "Oxygenation of the Atmosphere": "https://en.wikipedia.org/wiki/Great_Oxidation_Event",
    "First Complex Life": "https://en.wikipedia.org/wiki/Cambrian_explosion",
    "Dinosaurs Appear": "https://en.wikipedia.org/wiki/Dinosaur",
    "Dinosaur Extinction": "https://en.wikipedia.org/wiki/Cretaceous%E2%80%93Paleogene_extinction_event",
    "First Hominids": "https://en.wikipedia.org/wiki/Human_evolution",
    "Homo sapiens": "https://en.wikipedia.org/wiki/Homo_sapiens",
    "Agriculture Begins": "https://en.wikipedia.org/wiki/Neolithic_Revolution",
    "Writing Invented": "https://en.wikipedia.org/wiki/History_of_writing",
    "Great Pyramid of Giza": "https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza",
    "Roman Empire": "https://en.wikipedia.org/wiki/Roman_Empire",
    "Fall of Rome / Middle Ages": "https://en.wikipedia.org/wiki/Fall_of_the_Western_Roman_Empire",
    "Printing Press": "https://en.wikipedia.org/wiki/Printing_press",
    "Industrial Revolution": "https://en.wikipedia.org/wiki/Industrial_Revolution",
    "First Powered Flight": "https://en.wikipedia.org/wiki/Wright_Flyer",
    "Moon Landing": "https://en.wikipedia.org/wiki/Apollo_11",
    "Internet & World Wide Web": "https://en.wikipedia.org/wiki/History_of_the_Internet",
    "Quasars Light Up": "https://en.wikipedia.org/wiki/Quasar",
    "Cosmic Noon": "https://en.wikipedia.org/wiki/Galaxy_formation_and_evolution",
    "The Cosmic Web Forms": "https://en.wikipedia.org/wiki/Observable_universe",
    "Dark Energy Takes Over": "https://en.wikipedia.org/wiki/Dark_energy",
    "The Moon Forms": "https://en.wikipedia.org/wiki/Origin_of_the_Moon",
    "The First Oceans": "https://en.wikipedia.org/wiki/Origin_of_water_on_Earth",
    "Late Heavy Bombardment": "https://en.wikipedia.org/wiki/Late_Heavy_Bombardment",
    "Photosynthesis Invented": "https://en.wikipedia.org/wiki/Evolution_of_photosynthesis",
    "Complex Cells (Eukaryotes)": "https://en.wikipedia.org/wiki/Eukaryote",
    "Cells Begin Pairing Up (Sex Evolves)": "https://en.wikipedia.org/wiki/Evolution_of_sexual_reproduction",
    "Snowball Earth": "https://en.wikipedia.org/wiki/Snowball_Earth",
    "Plants Cover the Land": "https://en.wikipedia.org/wiki/Evolutionary_history_of_plants",
    "Fish Walk onto Land": "https://en.wikipedia.org/wiki/Tetrapod",
    "The Coal Forests": "https://en.wikipedia.org/wiki/Carboniferous",
    "The Great Dying": "https://en.wikipedia.org/wiki/Permian%E2%80%93Triassic_extinction_event",
    "Whales Return to the Sea": "https://en.wikipedia.org/wiki/Evolution_of_cetaceans",
    "The First Apes": "https://en.wikipedia.org/wiki/Ape",
    "Fire in Our Hands": "https://en.wikipedia.org/wiki/Control_of_fire_by_early_humans",
    "Out of Africa": "https://en.wikipedia.org/wiki/Early_human_migrations",
    "The Wheel Turns": "https://en.wikipedia.org/wiki/Wheel",
    "The Alphabet": "https://en.wikipedia.org/wiki/History_of_the_alphabet",
    "Democracy is Born": "https://en.wikipedia.org/wiki/Athenian_democracy",
    "The Islamic Golden Age": "https://en.wikipedia.org/wiki/Islamic_Golden_Age",
    "Two Worlds Collide": "https://en.wikipedia.org/wiki/Columbian_exchange",
    "Newton Rewrites the Sky": "https://en.wikipedia.org/wiki/Philosophi%C3%A6_Naturalis_Principia_Mathematica",
    "Vaccines Discovered": "https://en.wikipedia.org/wiki/Vaccination",
    "Electricity Lights Up the World": "https://en.wikipedia.org/wiki/Electrification",
    "Antibiotics Discovered": "https://en.wikipedia.org/wiki/Antibiotics",
    "The Transistor": "https://en.wikipedia.org/wiki/Transistor",
    "The DNA Double Helix": "https://en.wikipedia.org/wiki/History_of_molecular_biology",
    "The Human Genome Mapped": "https://en.wikipedia.org/wiki/Human_Genome_Project",
    "Smartphones Change Everything": "https://en.wikipedia.org/wiki/Smartphone",
    "The Modern Era": "https://en.wikipedia.org/wiki/Contemporary_history",
    "Menes Unifies Egypt": "https://en.wikipedia.org/wiki/Narmer",
    "Hammurabi's Code": "https://en.wikipedia.org/wiki/Code_of_Hammurabi",
    "The Neo-Assyrian Empire": "https://en.wikipedia.org/wiki/Neo-Assyrian_Empire",
    "Darius & the Persian Empire": "https://en.wikipedia.org/wiki/Achaemenid_Empire",
    "Alexander the Great": "https://en.wikipedia.org/wiki/Alexander_the_Great",
    "The Caliphates Spread": "https://en.wikipedia.org/wiki/Rashidun_Caliphate",
    "The Mongol Empire": "https://en.wikipedia.org/wiki/Mongol_Empire",
    "The British Empire": "https://en.wikipedia.org/wiki/British_Empire",
    "The World Wars": "https://en.wikipedia.org/wiki/World_war",
    "The Cold War": "https://en.wikipedia.org/wiki/Cold_War",
    "Creation": "https://en.wikipedia.org/wiki/Genesis_creation_narrative",
    "The Great Flood": "https://en.wikipedia.org/wiki/Genesis_flood_narrative",
    "Abraham's Journey": "https://en.wikipedia.org/wiki/Abraham",
    "Exodus & Mount Sinai": "https://en.wikipedia.org/wiki/The_Exodus",
    "King David Reigns": "https://en.wikipedia.org/wiki/David",
    "Solomon's Temple": "https://en.wikipedia.org/wiki/Solomon%27s_Temple",
    "The Babylonian Exile": "https://en.wikipedia.org/wiki/Babylonian_captivity",
    "The Return & Second Temple": "https://en.wikipedia.org/wiki/Second_Temple",
    "The Birth of Jesus": "https://en.wikipedia.org/wiki/Nativity_of_Jesus",
    "The Crucifixion & Resurrection": "https://en.wikipedia.org/wiki/Crucifixion_of_Jesus",
    "The Second Temple Falls": "https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(70_CE)",
  };

  /* -------------------------------------------------------------
     Words-to-know: quick definitions used for glossary chips.
     ------------------------------------------------------------- */
  const GLOSSARY = {
    "cosmic microwave background": "Light set free 380,000 years after the Big Bang, stretched by expansion into faint microwave glow that fills the whole sky.",
    "nucleosynthesis": "The fusion of atomic nuclei. Big Bang nucleosynthesis made the universe's first hydrogen and helium.",
    "cosmic inflation": "A theorist-favourite idea that space itself doubled in size many, many times in the universe's first split second.",
    "supernova": "The explosive death of a big star, briefly outshining its whole galaxy and scattering heavy elements into space.",
    "reionization": "When ultraviolet light from the first stars stripped electrons off hydrogen atoms across the entire universe.",
    "dark matter": "Invisible 'stuff' whose gravity shapes galaxies; it outweighs ordinary matter about five to one but has never been directly caught.",
    "protoplanetary disk": "A flat cloud of gas and dust around a newborn star where planets grow by sticking together.",
    "zircon": "An ultra-tough crystal that records its age in lead isotopes — our time capsule for Earth's first 500 million years.",
    "magma ocean": "A planet so young and hot that its entire surface is molten rock, from crust to core boundary.",
    "RNA world": "A chapter of early life where RNA both carried genetic instructions and helped reactions — before DNA and proteins split the jobs.",
    "stromatolites": "Living rock mounds stacked layer by layer by slimy mats of microbe — fossils that reach back 3.5 billion years.",
    "hydrothermal vent": "A deep-sea hot spring rich in minerals and energy gradients — a leading candidate for where life first got going.",
    "LUCA": "The Last Universal Common Ancestor — the single organism every living thing on Earth descends from.",
    "photosynthesis": "The chemical magic of turning light + water + carbon dioxide into sugar and free oxygen, done by plants and bacteria.",
    "banded iron formations": "Sea-floor rock with rusty red and dark grey stripes, recording the moment oxygen first rusted the oceans.",
    "snowball earth": "Intervals when ice reached the tropics and possibly froze the oceans almost pole to pole.",
    "Cambrian explosion": "In about 25 million years — a geologic blink — nearly every major animal body plan appears in the seas.",
    "iridium": "A metal that is rare on Earth's surface but common in asteroids — the 'smoking gun' layer for the dinosaur-killing impact.",
    "shocked quartz": "Quartz crystals scarred by extreme pressure, a physical fingerprint of meteor impacts that no volcano can copy.",
    "bipedal": "Walking upright on two legs — the defining shift of early human ancestors millions of years before big brains.",
    "introgression": "Genes moving between species through interbreeding — how modern humans picked up a little Neanderthal DNA.",
    "Neolithic": "The New Stone Age — when farming, villages, and polished tools replaced hunting and gathering.",
    "cuneiform": "The world's first writing: wedge shapes pressed into wet clay by reed styluses in ancient Mesopotamia.",
    "pozzolanic": "Mix-in that makes concrete harden underwater and even self-repair — Roman builders' secret recipe.",
    "movable type": "Reusable metal letters that can be rearranged for each page — the key to printing hundreds of identical copies cheaply.",
    "three-axis control": "The breakthrough of the Wright brothers: keeping an aircraft level and steerable using roll, pitch and yaw.",
  };

  /* -------------------------------------------------------------
     Glossary matching: which words-to-know appear in a passage?
     ------------------------------------------------------------- */
  function glossaryTermsFor(text) {
    const low = (text || "").toLowerCase();
    const found = [];
    Object.keys(GLOSSARY).forEach(function (term) {
      if (low.includes(term.toLowerCase())) {
        found.push({ term: term, def: GLOSSARY[term] });
      }
    });
    return found;
  }

  /* -------------------------------------------------------------
     Quiz generator. Builds classroom-style "which came first?"
     and "which is oldest?" questions from the milestone data.
     Pure: pass your own rng for deterministic tests.
     ------------------------------------------------------------- */
  function shuffle(arr, rng) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  function makeQuiz(count, rng) {
    rng = rng || Math.random;
    const n = Math.min(Math.max(count || 5, 1), 9);
    const used = new Set();
    function randomIndex() {
      let i;
      do { i = Math.floor(rng() * MILESTONES.length); } while (used.has(i));
      used.add(i);
      return i;
    }
    const questions = [];
    for (let k = 0; k < n; k++) {
      if (k % 2 === 0) {
        // Which came first? (larger yearsAgo = older = first)
        const a = randomIndex();
        let b = randomIndex();
        const first = MILESTONES[a].yearsAgo > MILESTONES[b].yearsAgo ? a : b;
        const second = first === a ? b : a;
        questions.push({
          type: "which-first",
          question: "Which happened FIRST?",
          options: [MILESTONES[a].title, MILESTONES[b].title],
          answerIndex: MILESTONES[a].title === MILESTONES[first].title ? 0 : 1,
          answer: MILESTONES[first].title,
          fact: MILESTONES[first].title + " came first, " +
            formatTime(MILESTONES[second].yearsAgo - MILESTONES[first].yearsAgo) +
            " before " + MILESTONES[second].title + "!",
        });
      } else {
        // Out of three, which is the OLDEST?
        const picks = [randomIndex(), randomIndex(), randomIndex()];
        const oldest = picks.reduce(function (best, i) {
          return MILESTONES[i].yearsAgo > MILESTONES[best].yearsAgo ? i : best;
        }, picks[0]);
        const runnerUp = picks.filter(function (i) { return i !== oldest; })
          .reduce(function (best, i) {
            return MILESTONES[i].yearsAgo > MILESTONES[best].yearsAgo ? i : best;
          });
        questions.push({
          type: "pick-oldest",
          question: "Out of these three, which is the OLDEST?",
          options: picks.map(function (i) { return MILESTONES[i].title; }),
          answerIndex: picks.indexOf(oldest),
          answer: MILESTONES[oldest].title,
          fact: MILESTONES[oldest].title + " is " +
            formatTime(MILESTONES[oldest].yearsAgo - MILESTONES[runnerUp].yearsAgo) +
            " older than " + MILESTONES[runnerUp].title + "!",
        });
      }
    }
    return questions;
  }

  function slugify(title) {
    return String(title)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  return {
    MILESTONES: MILESTONES,
    ERA_COLORS: ERA_COLORS,
    ERA_HUES: ERA_HUES,
    ERA_INFO: ERA_INFO,
    LEARN_MORE: LEARN_MORE,
    GLOSSARY: GLOSSARY,
    EVENT_COLORS: EVENT_COLORS,
    eraColor: eraColor,
    eventColor: eventColor,
    eventColorAlpha: eventColorAlpha,
    MAX_YEARS: MAX_YEARS,
    HUMAN_MAX: HUMAN_MAX,
    xPosition: xPosition,
    fracFor: fracFor,
    formatTime: formatTime,
    formatShort: formatShort,
    assignTiers: assignTiers,
    glossaryTermsFor: glossaryTermsFor,
    visibleInCivilization: visibleInCivilization,
    makeQuiz: makeQuiz,
    slugify: slugify,
  };
});
