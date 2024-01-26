const url = "https://api.coingecko.com/api/v3/simple/price";

const getGeskoPrices = async <T extends string>(tokens: T[]) => {
  const params = {
    ids: tokens,
    vs_currencies: "usd",
  };
  const urlParams = new URLSearchParams(params).toString();

  const response = await fetch(url + "?" + urlParams);
  const data: any = await response.json();

  const prices = tokens.reduce(
    (acc, token) => {
      return { ...acc, [token]: data[token]?.usd || 0 };
    },
    {} as Record<T, number>
  );

  return prices;
};

export default getGeskoPrices;
