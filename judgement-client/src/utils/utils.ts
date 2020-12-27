export class Utils {
  public static IsNullOrUndefined(arg: any) {
    return arg === null || arg === undefined || arg === '';
  }

  public static showErrorPopup(message: string) {
    alert(message);
  }
}