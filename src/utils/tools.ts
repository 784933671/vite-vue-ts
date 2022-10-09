//文件名称格式化
export function ucfirst(str: string): string {
  let strToLowerCase = str.toLowerCase();

  let strToLowerCaseNew = strToLowerCase.replace(
    /\b\w+\b/g,
    (word) => word.substring(0, 1).toUpperCase() + word.substring(1)
  );
  return strToLowerCaseNew.replace(/\//g, "");
}
//根据名字批量删除localStorage
export async function removeLocalStorageList(
  localStorageList: string[]
): Promise<void> {
  for (let item of localStorageList) {
    localStorage.removeItem(item);
  }
}
