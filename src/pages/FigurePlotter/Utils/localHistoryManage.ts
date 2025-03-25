import { message } from "antd";
import dayjs from "dayjs";
import { v4 } from "uuid";

export type localStorageData = {
    value: string,
    label: string,
    data: any
}

export const saveHitoryData = (localStorageKey: string, newData: any) => {
    const historyItemLimit = 7;
    const storageData = loadDataFromLocalStorage(localStorageKey)
    if (storageData.length >= historyItemLimit) {
        message.info(
            `目前仅支持保存${historyItemLimit}条数据，最旧的数据将被抹除。`
        );
    }
    // 获取当前时间戳
    const timestamp = new Date().getTime();
    // 使用dayjs将时间戳转换为指定格式
    const uuid = v4();
    const formattedDate =
        dayjs(timestamp).format("YYYY-MM-DD") + "-" + uuid.slice(0, 2);
    let newHistory = [
        {
            value: uuid,
            label: formattedDate,
            data: newData
        },
        ...storageData,
    ];
    if (newHistory.length > historyItemLimit) {
        newHistory = newHistory.slice(0, historyItemLimit);
    }
    saveDataToLocalStorage(newHistory, localStorageKey);
    return newHistory;
}

export const saveDataToLocalStorage = (data: any[], localStorageKey: string) => {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
};

export const loadDataFromLocalStorage = (localStorageKey: string): localStorageData[] => {
    const history = localStorage.getItem(localStorageKey);
    if (history) {
        return JSON.parse(history);
    }
    return [];
};