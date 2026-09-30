import next from "eslint-config-next";

const config = [
  ...next,
  {
    rules: {
      // Screenshots are tall scrolling captures measured at natural height; next/image would get in the way.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
];

export default config;
