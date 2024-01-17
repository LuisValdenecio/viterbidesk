export type Customer = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  image_url: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Agent = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  image_url: string;
  role: 'admin' | 'staff' | 'team-lead';
};
