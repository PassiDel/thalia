export default defineNitroPlugin(() => {
  process.on('SIGINT', () => {
    console.log('Ctrl-C was pressed');
    process.exit();
  });
});
