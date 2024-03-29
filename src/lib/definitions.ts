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
  name: string;
  email: string;
  role_name: 'owner' | 'admin' | 'agent' | 'customer';
};
