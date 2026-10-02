import { Product, Recipe, Order, StoreSettings } from '../types';

// Asset paths
import imgHero from '../assets/images/hero_food_1790906515557.jpg';
import imgBurgerSpecial from '../assets/images/burger_special_1790906532890.jpg';
import imgBurgerChicken from '../assets/images/burger_chicken_1790906560577.jpg';
import imgPopiaOriginal from '../assets/images/popia_original_1790906545705.jpg';
import imgPopiaSpicy from '../assets/images/popia_spicy_1790906576395.jpg';
import imgPopiaCheese from '../assets/images/popia_cheese_1790906587548.jpg';
import imgChefOwner from '../assets/images/chef_owner_1790906602019.jpg';

export {
  imgHero,
  imgBurgerSpecial,
  imgBurgerChicken,
  imgPopiaOriginal,
  imgPopiaSpicy,
  imgPopiaCheese,
  imgChefOwner
};

export const INITIAL_PRODUCTS: Product[] = [
  // --- BURGER SECTION ---
  {
    id: 'burger-daging-special',
    name: 'Burger Daging Special Homemade',
    category: 'burger',
    tagline: 'Patty Daging Segar, Telur Banji & Sos Lada Hitam Rahsia',
    description: 'Patty daging lembu segar dikisar sendiri dengan rempah istimewa dapur bonda. Dibalut telur goyang lembut, hirisan keju cheddar berkrim, timun Jepun rangup, tomato ceri dan limpahan sos lada hitam Sarawak istimewa.',
    image: imgBurgerSpecial,
    basePrice: 11.50,
    isPopular: true,
    flavor: 'Black Pepper',
    inStock: true,
    stockCount: 45,
    comboAvailable: true,
    comboPriceExtra: 4.50
  },
  {
    id: 'burger-ayam-crispy',
    name: 'Burger Ayam Crispy Buttermilk',
    category: 'burger',
    tagline: 'Isi Ayam Rangup Emas, Sos Keju Meleleh & Coleslaw Segar',
    description: 'Fillet isi dada ayam segar diperap semalaman bersama susu mentega dan herba rahsia, disalut tepung rangup keemasan. Dihidang bersama slaw kubis ungu segar dan sos keju berkrim manis pedas.',
    image: imgBurgerChicken,
    basePrice: 10.90,
    isPopular: true,
    flavor: 'Cheese',
    inStock: true,
    stockCount: 38,
    comboAvailable: true,
    comboPriceExtra: 4.50
  },
  {
    id: 'burger-daging-double-cheese',
    name: 'Burger Double Daging & Double Cheese',
    category: 'burger',
    tagline: '2 Keping Patty Juicy, 2 Keping Keju Leleh & Bawang Karamel',
    description: 'Untuk peminat daging sebenar! Dua keping daging juicy tebal dengan dua lapisan keju cheddar leleh panas serta bawang holland yang dikaramelkan perlahan dengan mentega tulen.',
    image: imgBurgerSpecial,
    basePrice: 15.50,
    isPopular: false,
    flavor: 'Original',
    inStock: true,
    stockCount: 25,
    comboAvailable: true,
    comboPriceExtra: 4.50
  },
  {
    id: 'burger-ayam-grill-bbq',
    name: 'Burger Ayam Bakar BBQ Madu',
    category: 'burger',
    tagline: 'Paha Ayam Tanpa Tulang Diperap Sos BBQ Madu Kelulut',
    description: 'Daging paha ayam lembut dipanggang atas kuali leper panas bersama salutan sos barbeku madu aroma asap kayu manis. Kurang berminyak, sihat dan sangat berjus.',
    image: imgBurgerChicken,
    basePrice: 12.00,
    isPopular: false,
    flavor: 'BBQ',
    inStock: true,
    stockCount: 30,
    comboAvailable: true,
    comboPriceExtra: 4.50
  },

  // --- POPIA SIMPUL SECTION ---
  {
    id: 'popia-simpul-original',
    name: 'Popia Simpul Original (Serunding Ikan)',
    category: 'popia',
    tagline: 'Inti Serunding Ikan Selayang Kampung & Aroma Serai Asli',
    description: 'Popia simpul kasih tradisional yang digunting halus dan disimpul rapi sekeping demi sekeping. Berintikan serunding ikan selayang segar yang dimasak kering bersama serai, halia dan santan kelapa sawit asli. Sangat rangup dan tidak berminyak!',
    image: imgPopiaOriginal,
    basePrice: 12.00,
    isPopular: true,
    flavor: 'Original',
    inStock: true,
    stockCount: 65,
    sizes: [
      { id: 'size-s', name: 'Balang Comel (Kecil)', weightOrSize: '180 gram', price: 12.00 },
      { id: 'size-m', name: 'Balang Standard (Pilihan Ramai)', weightOrSize: '350 gram', price: 22.00 },
      { id: 'size-l', name: 'Balang Mega Kenduri / Famili', weightOrSize: '650 gram', price: 38.00 }
    ]
  },
  {
    id: 'popia-simpul-pedas',
    name: 'Popia Simpul Pedas Manis Berapi',
    category: 'popia',
    tagline: 'Serunding Ikan Cili Kering & Daun Kari Wangi',
    description: 'Versi pedas menggiurkan dengan adunan cili kering giling tempatan, gula perang melaka dan daun kari rangup. Rasa pedas-pedas manis yang buatkan anda tidak boleh berhenti mengunyah.',
    image: imgPopiaSpicy,
    basePrice: 13.00,
    isPopular: true,
    isSpicy: true,
    spiceLevel: 'Pedas Berapi',
    flavor: 'Pedas',
    inStock: true,
    stockCount: 50,
    sizes: [
      { id: 'size-s', name: 'Balang Comel (Kecil)', weightOrSize: '180 gram', price: 13.00 },
      { id: 'size-m', name: 'Balang Standard (Pilihan Ramai)', weightOrSize: '350 gram', price: 24.00 },
      { id: 'size-l', name: 'Balang Mega Kenduri / Famili', weightOrSize: '650 gram', price: 40.00 }
    ]
  },
  {
    id: 'popia-simpul-cheese',
    name: 'Popia Simpul Golden Cheese',
    category: 'popia',
    tagline: 'Disalut Serbuk Keju Cheddar Premium Lemak Manis',
    description: 'Inovasi kegemaran anak-anak dan generasi muda! Kerangupan popia simpul disaluti serbuk keju cheddar premium yang pekat beraroma mentega. Gabungan masin, manis dan rangup yang sempurna.',
    image: imgPopiaCheese,
    basePrice: 14.00,
    isPopular: false,
    flavor: 'Cheese',
    inStock: true,
    stockCount: 40,
    sizes: [
      { id: 'size-s', name: 'Balang Comel (Kecil)', weightOrSize: '180 gram', price: 14.00 },
      { id: 'size-m', name: 'Balang Standard (Pilihan Ramai)', weightOrSize: '350 gram', price: 25.00 },
      { id: 'size-l', name: 'Balang Mega Kenduri / Famili', weightOrSize: '650 gram', price: 42.00 }
    ]
  },

  // --- KOMBO SECTION ---
  {
    id: 'kombo-kasih-petang',
    name: 'Kombo Minum Petang Kasih',
    category: 'kombo',
    tagline: '1 Burger Pilihan + 1 Balang Popia Simpul 180g + Air Sejuk',
    description: 'Set paling berbaloi untuk dinikmati bersama keluarga atau rakan sekerja. Dapatkan 1 Burger Daging Special atau Ayam Crispy, 1 Balang Popia Simpul Original (180g) dan 1 Minuman Segar Limau Ais / Teh O Ais.',
    image: imgHero,
    basePrice: 22.00,
    isPopular: true,
    inStock: true,
    stockCount: 20
  }
];

export const RECIPES: Recipe[] = [
  {
    id: 'recipe-burger',
    title: 'A. Cara Membuat Burger Homemade Dapur Bonda',
    subtitle: 'Rahsia patty daging lembut berjus tidak kering & teknik balut telur goyang',
    prepTime: '25 minit',
    cookTime: '12 minit',
    servings: '4 biji burger besar',
    difficulty: 'Mudah',
    image: imgBurgerSpecial,
    ingredients: [
      {
        category: 'Bahan Patty Daging (Homemade)',
        items: [
          '500g daging lembu cincang segar (nisbah 80% daging merah + 20% lemak supaya kekal berjus)',
          '1 biji bawang holland (dicincang halus dan ditumis sebentar hingga wangi)',
          '3 ulas bawang putih (ditumbuk halus)',
          '1 biji telur gred B',
          '3 sudu besar serbuk roti putih (breadcrumbs) untuk memegang kelembapan',
          '1 sudu kecil lada hitam Sarawak (ditumbuk kasar)',
          '1 sudu kecil garam bukit & sedikit serbuk perasa'
        ]
      },
      {
        category: 'Bahan Roti & Pelengkap',
        items: [
          '4 biji roti burger brioche gebu bertabur bijan',
          '4 keping keju cheddar lembut',
          '4 biji telur ayam (untuk teknik telur bungkus gaya pasar malam premium)',
          'Sayur salad coral segar, timun jepun & hirisan tomato masak ranum',
          'Mentega tulen untuk melenser roti'
        ]
      },
      {
        category: 'Sos Rahsia Campuran',
        items: [
          '4 sudu besar sos lada hitam pekat',
          '3 sudu besar mayonis lembut',
          '2 sudu besar sos cili manis',
          '1 sudu kecil kicap pekat manis & sedikit perahan limau kasturi'
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Mengadun Daging Patty Tanpa Terlebih Ramas',
        description: 'Satukan daging cincang, tumisan bawang holland, bawang putih, telur, serbuk roti, garam dan lada hitam ke dalam mangkuk bersih. Gaulkan mesra dengan hujung jari sahaja — jangan uli terlalu lama supaya serat daging tidak keras.',
        tip: 'Rahsia Chef: Simpan adunan dalam peti sejuk selama 20 minit sebelum dibentuk supaya rempah meresap mesra.'
      },
      {
        stepNumber: 2,
        title: 'Membentuk Patty & Membuat Lekukan Tengah',
        description: 'Bahagikan adunan kepada 4 bebola sama saiz (kira-kira 125g setiap satu). Tekan leper perlahan menjadi bentuk bulat dengan ketebalan 1.5 cm. Tekan bahagian tengah dengan ibu jari sedikit melengkung ke dalam.',
        tip: 'Lekukan tengah menghalang patty daripada menggelembung menjadi bulat bila dipanggang.'
      },
      {
        stepNumber: 3,
        title: 'Memanggang Patty Atas Kuali Leper Panas (Sear)',
        description: 'Panaskan kuali leper dengan sedikit mentega pada api sederhana tinggi. Letak patty dan biarkan selama 3-4 minit sehingga permukaan bawah keperangan garing (seared). Balikkan sekali sahaja.',
        tip: 'JANGAN sesekali menekan patty dengan sudip! Tekanan akan memicit keluar semua jus manis daging.'
      },
      {
        stepNumber: 4,
        title: 'Teknik Balut Telur Bungkus & Cairkan Keju',
        description: 'Di sebelah ruang kuali, pecahkan telur ayam dan ratakan nipis. Renjiskan sedikit sos lada hitam. Letakkan patty masak bersama sekeping keju cheddar di atasnya, lalu lipat keempat-empat sisi telur membalut kemas patty.',
        tip: 'Haba dari patty panas akan terus mencairkan keju cheddar menjadi berkrim di dalam balutan telur.'
      },
      {
        stepNumber: 5,
        title: 'Bakar Roti & Susun Lapis Burger',
        description: 'Belah dua roti brioche, sapukan mentega dan layurkan sekejap atas kuali panas sehingga perang wangi. Sapu lapisan bawah roti dengan sos rahsia, letak salad segar, tomato, patty bungkus telur, sos lada hitam tambahan, dan tutup dengan roti atas.',
        tip: 'Makan panas-panas untuk menikmati keenakan lelehan keju dan keempukan roti brioche!'
      }
    ],
    proTips: [
      'Gunakan daging berkualiti segar tempatan untuk rasa manis semula jadi tanpa bau hanyir.',
      'Sapu mentega pada bahagian dalam roti burger sebelum dibakar supaya roti tidak cepat lembik menyerap sos.',
      'Sos campuran boleh disediakan awal dalam botol sos untuk memudahkan proses menyiram atas burger.'
    ]
  },
  {
    id: 'recipe-popia',
    title: 'B. Cara Membuat Popia Simpul Kasih Tradisional',
    subtitle: 'Kudapan warisan rangup krup-krup tahan berbulan tanpa bau tengik',
    prepTime: '45 minit',
    cookTime: '20 minit',
    servings: '1 Balang Besar (kira-kira 300 biji simpul)',
    difficulty: 'Perlu Kesabaran',
    image: imgPopiaOriginal,
    ingredients: [
      {
        category: 'Bahan Kulit & Inti',
        items: [
          '1 bungkus kulit popia berkualiti nipis (saiz 8.5 inci x 8.5 inci, simpan bawah kain lembap supaya tidak kering)',
          '250g serunding ikan selayang kampung asli (dimasak kering tanpa minyak berlebihan)',
          'Minyak masak berkualiti (secukupnya untuk teknik deep-fry)',
          'Gunting tajam bersih dapur'
        ]
      },
      {
        category: 'Bahan Serunding Ikan Tradisi (Jika Buat Sendiri)',
        items: [
          '500g isi ikan selayang rebus (diasingkan tulang & diramas halus)',
          '4 batang serai (dihiris dan dikisar halus)',
          '5 ulas bawang merah & 3 ulas bawang putih',
          '1 inci halia segar & 1 sudu kecil serbuk kunyit',
          '1 cawan santan pekat segar',
          '2 sudu makan gula perang & garam secukup rasa'
        ]
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Menggunting Jalur Kulit Popia Yang Kemas',
        description: 'Ambil 5-6 keping kulit popia berlapis. Gunting menjadi dua bahagian sama saiz. Kemudian setiap bahagian digunting lagi menjadi 4 jalur memanjang. Anda akan mendapat kira-kira 8 jalur kecil segi empat tepat daripada sekeping kulit popia.',
        tip: 'Sentiasa tutup jalur kulit popia dengan tuala lembap yang bersih supaya kulit kekal anjal dan tidak patah bila disimpul.'
      },
      {
        stepNumber: 2,
        title: 'Meletakkan Inti Serunding Secukupnya',
        description: 'Bentangkan sejalur kulit popia atas papan pemotong. Ambil secubit kecil serunding ikan (kira-kira suku sudu kecil sahaja) dan letakkan di tengah-tengah jalur secara memanjang.',
        tip: 'Jangan letak inti terlalu padat atau terlalu basah kerana ini boleh menyebabkan kulit koyak semasa disimpul.'
      },
      {
        stepNumber: 3,
        title: 'Teknik Mengikat "Simpul Kasih" Yang Sempurna',
        description: 'Lipat sedikit sisi kulit membalut serunding, kemudian pegang kedua-dua hujung jalur dan ikat simpul mati dengan perlahan seperti mengikat tali kasut. Tarik hujungnya dengan lembut hingga kemas.',
        tip: 'Jangan tarik terlalu ketat sehingga putus. Simpul yang baik nampak seperti reben kecil yang cantik.'
      },
      {
        stepNumber: 4,
        title: 'Teknik Menggoreng Api Perlahan-Sederhana',
        description: 'Panaskan minyak yang banyak di dalam kuali dengan api sederhana. Uji kepanasan dengan memasukkan satu simpul; jika ia terus timbul perlahan bersama buih halus, minyak sudah sedia. Masukkan segenggam demi segenggam simpul dan kacau perlahan berterusan.',
        tip: 'Kacau secara pusingan membulat perlahan-lahan supaya seluruh popia masak rata keemasan dan tidak hangus sebahagian.'
      },
      {
        stepNumber: 5,
        title: 'Mengetus Minyak & Menyimpan Dalam Balang Kedap Udara',
        description: 'Bila popia bertukar warna kuning keemasan muda (golden blonde), angkat segera dengan penapis jejaring kerana haba baki akan terus menggelapkan sedikit warnanya. Toskan minyak atas kertas penyerap dan biarkan betul-betul sejuk pada suhu bilik.',
        tip: 'HANYA masukkan ke dalam balang kedap udara bila popia SUDAH SEJUK SEPENUHNYA. Jika dimasukkan semasa suam, wap akan membuatkan popia lemau.'
      }
    ],
    proTips: [
      'Serunding ikan mestilah betul-betul kering dan berderai sebelum digunakan.',
      'Gunakan minyak masak yang baru dan bersih untuk mengelakkan rasa tengik selepas disimpan lama.',
      'Untuk variasi Popia Cheese: Taburkan serbuk cheese semasa popia baru diangkat dan masih sedikit hangat supaya serbuk melekat sempurna.',
      'Untuk Popia Pedas: Gaul dengan sedikit serbuk cili kampung dan daun kari goreng yang ditumbuk halus.'
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'BP-8801',
    createdAt: '2026-10-01 17:45',
    customerName: 'Siti Aminah Razali',
    customerPhone: '012-3456789',
    deliveryMethod: 'delivery',
    address: 'No 24, Jalan Plumbum 7/95, Seksyen 7, 40000 Shah Alam, Selangor',
    preferredTime: 'Makan Malam (8:00 PM)',
    notes: 'Sos black pepper lebihkan sedikit ya Kak, terima kasih!',
    items: [
      {
        cartItemId: 'item-1',
        productId: 'burger-daging-special',
        name: 'Burger Daging Special Homemade',
        image: imgBurgerSpecial,
        isCombo: true,
        unitPrice: 16.00,
        quantity: 2
      },
      {
        cartItemId: 'item-2',
        productId: 'popia-simpul-original',
        name: 'Popia Simpul Original (Balang Standard)',
        image: imgPopiaOriginal,
        selectedSize: { id: 'size-m', name: 'Balang Standard (Pilihan Ramai)', weightOrSize: '350 gram', price: 22.00 },
        unitPrice: 22.00,
        quantity: 1
      }
    ],
    subtotal: 54.00,
    deliveryFee: 0,
    discount: 5.00,
    total: 49.00,
    paymentMethod: 'duitnow',
    status: 'Sedang Dimasak'
  },
  {
    id: 'ord-1002',
    orderNumber: 'BP-8802',
    createdAt: '2026-10-01 18:10',
    customerName: 'Muhammad Farhan',
    customerPhone: '019-8765432',
    deliveryMethod: 'pickup',
    address: '',
    preferredTime: 'Ambil Sendiri jam 7:30 PM',
    notes: 'Saya bawa mangkuk tingkat sendiri untuk kurangkan plastik',
    items: [
      {
        cartItemId: 'item-3',
        productId: 'burger-ayam-crispy',
        name: 'Burger Ayam Crispy Buttermilk',
        image: imgBurgerChicken,
        isCombo: false,
        unitPrice: 10.90,
        quantity: 3
      },
      {
        cartItemId: 'item-4',
        productId: 'popia-simpul-pedas',
        name: 'Popia Simpul Pedas Manis (Balang Comel)',
        image: imgPopiaSpicy,
        selectedSize: { id: 'size-s', name: 'Balang Comel (Kecil)', weightOrSize: '180 gram', price: 13.00 },
        unitPrice: 13.00,
        quantity: 2
      }
    ],
    subtotal: 58.70,
    deliveryFee: 0,
    discount: 0,
    total: 58.70,
    paymentMethod: 'fpx',
    status: 'Baru'
  },
  {
    id: 'ord-1003',
    orderNumber: 'BP-8799',
    createdAt: '2026-10-01 15:20',
    customerName: 'Puan Halimah Yusof',
    customerPhone: '013-9988771',
    deliveryMethod: 'delivery',
    address: 'Kolej Melati, UiTM Shah Alam',
    preferredTime: 'Minum Petang (5:00 PM)',
    notes: 'Hantar ke pondok pengawal asrama',
    items: [
      {
        cartItemId: 'item-5',
        productId: 'kombo-kasih-petang',
        name: 'Kombo Minum Petang Kasih',
        image: imgHero,
        unitPrice: 22.00,
        quantity: 2
      }
    ],
    subtotal: 44.00,
    deliveryFee: 0,
    discount: 0,
    total: 44.00,
    paymentMethod: 'cod',
    status: 'Selesai'
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'Burger & Popia Simpul',
  tagline: 'Dibuat Dengan Hati • Resipi Asli Dapur Bonda',
  ownerName: 'Kak Zamziah & Keluarga',
  whatsappNumber: '60193482901',
  deliveryFee: 5.00,
  freeDeliveryThreshold: 40.00,
  isOpen: true,
  operatingHours: 'Setiap Hari: 2:00 Petang – 10:30 Malam',
  pickupLocation: 'Dapur Bonda, Jalan Plumbum 7/102, Seksyen 7, Shah Alam',
  deliveryCoverageArea: 'Seksyen 7, Seksyen 2, Seksyen 3, Padang Jawa, UiTM & UNISEL Shah Alam (Seluruh Malaysia untuk Popia Simpul pos)',
  announcement: '🎉 Selamat Datang! Dapatkan Penghantaran Percuma untuk pesanan RM40 ke atas. Gunakan kod diskaun KASIH5 untuk jimat RM5!',
  heroImage: imgHero,
  ownerImage: imgChefOwner,
  heroTitle: 'Burger Sedap, Popia Rangup, Dibuat Dengan Hati',
  heroSubtitle: 'Nikmati kelembutan patty burger daging & ayam berjus homemade yang dibakar panas, digandingkan bersama keasyikan kudapan warisan Popia Simpul Kasih berinti serunding ikan kampung asli. Rangup krup-krup, segar tanpa bahan pengawet!',
  bankName: 'Maybank',
  bankAccountNo: '5123 4567 8901',
  bankAccountHolder: 'Zamziah Binti Hassan',
  duitNowQrPhone: '019-348 2901',
  coupons: [
    {
      id: 'c-1',
      code: 'KASIH5',
      discountType: 'fixed',
      discountValue: 5.00,
      minSpend: 25.00,
      description: 'Potongan RM 5.00 untuk pesanan RM 25 ke atas',
      active: true,
    },
    {
      id: 'c-2',
      code: 'SEDAP10',
      discountType: 'percentage',
      discountValue: 10,
      minSpend: 35.00,
      description: 'Diskaun 10% untuk pesanan RM 35 ke atas',
      active: true,
    }
  ]
};
