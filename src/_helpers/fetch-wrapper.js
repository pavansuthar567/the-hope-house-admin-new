import {
  getDatabase,
  set,
  ref,
  onValue,
  remove,
  update,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';

import {
  cmsApp,
  amsApp,
  productsApp,
  ordersApp,
  reviewAndRatingApp,
  appointmentApp,
  customJewelryApp,
  subscribersApp,
  getAppCheckToken,
  storageApp,
  defaultApp,
  returnsApp,
} from '../firebase';
import { fhelper } from './fhelper';
import {
  adminUrl,
  appointmentsUrl,
  brandSliderUrl,
  collectionUrl,
  customJewelryUrl,
  customizationSubTypeUrl,
  customizationTypeUrl,
  customizationUrl,
  menuCategoriesUrl,
  menuSubCategoriesUrl,
  menuUrl,
  ordersUrl,
  productSliderUrl,
  productTypeUrl,
  productsUrl,
  reviewAndRatingUrl,
  showCaseBannerUrl,
  subscribersUrl,
  userUrl,
  storageUrl,
  returnsUrl,
} from './environment';

// Get the default database instance
// const db = getDatabase(defaultApp);

const getDBFromUrl = (url) => {
  if ([userUrl].includes(url)) {
    return getDatabase(cmsApp);
  } else if (
    [
      adminUrl,
      menuUrl,
      menuCategoriesUrl,
      menuSubCategoriesUrl,
      productTypeUrl,
      customizationUrl,
      customizationTypeUrl,
      customizationSubTypeUrl,
      collectionUrl,
      showCaseBannerUrl,
      productSliderUrl,
      brandSliderUrl,
    ].includes(url)
  ) {
    return getDatabase(amsApp);
  } else if ([productsUrl].includes(url)) {
    return getDatabase(productsApp);
  } else if ([ordersUrl].includes(url)) {
    return getDatabase(ordersApp);
  } else if ([reviewAndRatingUrl].includes(url)) {
    return getDatabase(reviewAndRatingApp);
  } else if ([appointmentsUrl].includes(url)) {
    return getDatabase(appointmentApp);
  } else if ([customJewelryUrl].includes(url)) {
    return getDatabase(customJewelryApp);
  } else if ([subscribersUrl].includes(url)) {
    return getDatabase(subscribersApp);
  } else if ([returnsUrl].includes(url)) {
    return getDatabase(returnsApp);
  } else {
    getDatabase(defaultApp);
  }
};

const getAppFromUrl = (url) => {
  if ([userUrl].includes(url)) {
    return cmsApp;
  } else if (
    [
      adminUrl,
      menuUrl,
      menuCategoriesUrl,
      menuSubCategoriesUrl,
      productTypeUrl,
      customizationUrl,
      customizationTypeUrl,
      customizationSubTypeUrl,
      collectionUrl,
      showCaseBannerUrl,
      productSliderUrl,
      brandSliderUrl,
    ].includes(url)
  ) {
    return amsApp;
  } else if ([productsUrl].includes(url)) {
    return productsApp;
  } else if ([ordersUrl].includes(url)) {
    return ordersApp;
  } else if ([reviewAndRatingUrl].includes(url)) {
    return reviewAndRatingApp;
  } else if ([appointmentsUrl].includes(url)) {
    return appointmentApp;
  } else if ([customJewelryUrl].includes(url)) {
    return customJewelryApp;
  } else if ([subscribersUrl].includes(url)) {
    return subscribersApp;
  } else if ([returnsUrl].includes(url)) {
    return returnsApp;
  } else if ([storageUrl].includes(url)) {
    return storageApp;
  } else {
    return defaultApp;
  }
};

const getAll = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const token = await getAppCheckToken(url);
      // if (!token) {
      //   reject(new Error("Token not found"));
      //   return;
      // }
      const db = getDBFromUrl(url);
      onValue(
        ref(db, url),
        (snapshot) => {
          const data = snapshot.val();
          resolve(data);
          return;
        },
        (error) => {
          reject(error);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

const create = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { url, insertPattern } = params;
      if (url && insertPattern) {
        const parsedUrl = fhelper.removeLastSegment(url);
        // const token = await getAppCheckToken(parsedUrl);
        // if (!token) {
        //   reject(new Error("Token not found"));
        //   return;
        // }
        const db = getDBFromUrl(parsedUrl);
        set(ref(db, url), insertPattern);
        resolve(true);
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const _update = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { url, payload } = params;
      if (url && payload) {
        const parsedUrl = fhelper.removeLastSegment(url);
        // const token = await getAppCheckToken(parsedUrl);
        // if (!token) {
        //   reject(new Error("Token not found"));
        //   return;
        // }
        const db = getDBFromUrl(parsedUrl);
        update(ref(db, url), payload);
        resolve(true);
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const _delete = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedUrl = fhelper.removeLastSegment(url);
      // const token = await getAppCheckToken(parsedUrl);
      // if (!token) {
      //   reject(new Error("Token not found"));
      //   return;
      // }
      const db = getDBFromUrl(parsedUrl);
      remove(ref(db, url));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const findOne = (url, findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const keyValuePairs = Object.keys(findPattern).map((key) => ({
        key,
        value: findPattern[key],
      }));
      const data = await getOrderByChildWithEqualto(url, keyValuePairs[0]);
      const findedData = data.length ? data[0] : null;
      resolve(findedData);
    } catch (e) {
      reject(e);
    }
  });
};

const find = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { url, key, value } = findPattern;
      const data = await getOrderByChildWithEqualto(url, { key, value });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

const findMany = async (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { url, filterParams } = findPattern;
      const filterPromises = Object.keys(filterParams).map(async (key) => {
        const value = filterParams[key];
        const keyValuePairs = { key, value };
        return getOrderByChildWithEqualto(url, keyValuePairs);
      });
      const filteredDataArray = await Promise.all(filterPromises);
      const filteredData = filteredDataArray.flat();
      resolve(filteredData);
    } catch (e) {
      reject(e);
    }
  });
};

const findOneWithNotEqual = (url, findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, key, value } = findPattern;
      const data = await getOrderByChildWithEqualto(url, { key, value });
      const findedData = data.length
        ? data.filter((x) => x.id.toLowerCase() !== id.toLowerCase())
        : [];
      resolve(findedData);
    } catch (e) {
      reject(e);
    }
  });
};

const findManyWithNotEqual = async (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { url, id, filterParams } = findPattern;
      const filterPromises = Object.keys(filterParams).map(async (key) => {
        const value = filterParams[key];
        const keyValuePairs = { key, value };
        return getOrderByChildWithEqualto(url, keyValuePairs);
      });
      const filteredDataArray = await Promise.all(filterPromises);
      const filteredData = filteredDataArray.flat();
      const filteredDataWithNotEqual = filteredData.filter(
        (item) => item.id.toLowerCase() !== id.toLowerCase()
      );
      resolve(filteredDataWithNotEqual);
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderByChildWithEqualto = (url, findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { key, value } = findPattern;

      // const token = await getAppCheckToken(url);
      // if (!token) {
      //   reject(new Error("Token not found"));
      //   return;
      // }

      const db = getDBFromUrl(url);
      const findQuery = query(ref(db, url), orderByChild(key), equalTo(value));
      onValue(findQuery, (snapshot) => {
        const data = snapshot.exists() ? Object.values(snapshot.val()) : [];
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getPaginatdData = (url, searchQuery = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      // const token = await getAppCheckToken(url);
      // if (!token) {
      //   reject(new Error("Token not found"));
      //   return;
      // }
      const db = getDBFromUrl(url);
      let listQuery = query(ref(db, url));
      if (searchQuery) {
      }
      onValue(listQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          resolve(data);
        } else {
          resolve([]);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchWrapperService = {
  getAll,
  create,
  findOne,
  find,
  findOneWithNotEqual,
  _delete,
  _update,
  getPaginatdData,
  findMany,
  findManyWithNotEqual,
  getAppFromUrl,
};
