// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const customers = [
  {
    id: '410544b2-4301-4271-9855-fec4b6a7442a',
    name: 'Alex Kop',
    email: 'alex@nextmail.com',
    image_url: '/customers/delba-de-oliveira.png',
    password: '123456',
  },
  {
    id: '410544b2-5001-4271-9855-fec4b6a6442a',
    name: 'Francis Carl',
    email: 'francis@nextmail.com',
    image_url: '/customers/delba-de-oliveira.png',
    password: '123456',
  },
  {
    id: '410544b2-7001-4271-9855-fec4b6a6442a',
    name: 'Manuel José',
    email: 'manuel@nextmail.com',
    image_url: '/customers/delba-de-oliveira.png',
    password: '123456',
  },
  {
    id: '410544b2-3001-4271-9855-fec4b6a6442a',
    name: 'Carlos Ferreira',
    email: 'carlos@nextmail.com',
    image_url: '/customers/delba-de-oliveira.png',
    password: '123456',
  },
];

const agents = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
    role: 'staff',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
    role: 'staff',
  },
  {
    id: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
    name: 'Hector Simpson',
    email: 'hector@simpson.com',
    image_url: '/customers/hector-simpson.png',
    role: 'staff',
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Steven Tey',
    email: 'steven@tey.com',
    image_url: '/customers/steven-tey.png',
    role: 'staff',
  },
  {
    id: '3958dc9e-787f-4377-85e9-fec4b6a6442a',
    name: 'Steph Dietz',
    email: 'steph@dietz.com',
    image_url: '/customers/steph-dietz.png',
    role: 'staff',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
    role: 'staff',
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
    role: 'staff',
  },
  {
    id: '126eed9c-c90c-4ef6-a4a8-fcf7408d3c66',
    name: 'Emil Kowalski',
    email: 'emil@kowalski.com',
    image_url: '/customers/emil-kowalski.png',
    role: 'staff',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
    role: 'staff',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
    role: 'staff',
  },
];

module.exports = {
  agents,
  customers,
};
