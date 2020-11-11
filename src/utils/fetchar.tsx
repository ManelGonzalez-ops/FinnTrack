
export const fetchar = async (url: string, query: string) => {

    const rawData = await fetch(`${url}/${query}`);
    const { data } = await rawData.json();
    return data
}
