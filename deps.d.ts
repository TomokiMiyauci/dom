declare module "npm:xml-name-validator@4.0.0" {
  const validator: {
    name: (name: string) => boolean;
    qname: (name: string) => boolean;
  };
  export default validator;
}

declare module "npm:is-negative-zero" {
  export default function (input: unknown): boolean;
}
