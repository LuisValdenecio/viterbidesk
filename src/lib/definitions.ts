export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  password: string;
};

export type Agent = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  role: 'admin' | 'staff' | 'team-lead';
};
