declare module 'jsonlint-mod' {
  const jsonlint: {
    parse: (text: string) => any;
  };
  export default jsonlint;
}
