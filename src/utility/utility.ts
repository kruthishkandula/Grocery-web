export const _isActiveData = (data: any) => {
    return data?.filter((item: any) => item?.is_active === true)
}

export const _randmomString = (length: number = 32): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const findObject = ({
  data,
  key,
  value,
}: {
  data: any[];
  key: string;
  value: string | boolean;
}) => {
  let ArrayData: any[] = [];

  if (Array.isArray(data)) {
    ArrayData = data;
  } else if (typeof data === 'object') {
    ArrayData = [data];
  } else {
    ArrayData = [];
  }

  for (let i = 0; i < ArrayData.length; i++) {
    if (ArrayData[i][key] === value) {
      return ArrayData[i];
    }
  }
  return null; // Return null if no matching object is found
};