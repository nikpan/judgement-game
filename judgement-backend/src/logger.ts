export default class Logger {
  public static log(message: string) {
    console.log(message);
  }

  public static debug(message: any) {
    console.debug(message);
  }
}