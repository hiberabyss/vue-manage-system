import request from '../utils/request';

export const fetchData = query => {
    return request({
        // url: './adsconf.json',
        url: 'http://10.40.10.23:8080/SetConfService/GetConf',
        method: 'get',
        params: query
    });
};
