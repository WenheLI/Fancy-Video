import { Config } from './config';

const apiAuth = Config.path + '/auth';
const apiUpload = Config.path + '/upload';
const apiMedia = Config.path + '/media';

const headers = {
    'Accept': 'application/json',
};

const postContent = (content, api) =>
    Promise.race(
            [
                fetch(api, {
                method: 'POST',
                mode: 'cors',
                headers: Object.assign(headers, {'Content-Type': 'application/json'}),
                body: JSON.stringify({content})
                })
                
            ]
        ).then((res) => res.json())
         .catch(rej => ({status:-2}));

const getContent = (api, query) => 
    Promise.race(
        [
            fetch(api+'?'+query, {
                method: 'GET',
                mode: 'cors',
                headers: Object.assign(headers, {'Content-Type': 'application/json'}),
            })
        ]
    ).then((res) => res.json()).catch(rej => ({status:-2}));


export const create = (content) =>
    postContent(content, `${apiAuth}/create`);


export const login = (content) =>
    postContent(content, `${apiAuth}/login`);

export const autoLogin = (content) =>
    postContent(content, `${apiAuth}/autologin`);

export const upload = (data, type) => fetch(apiUpload+type, {
    method: 'POST',
    body: data
}, headers)
    .then(response => response.json())
    .catch(rej => ({status:-2}));

export const getMedia = (query) => getContent(apiMedia, query)

export const queryMedia = (content) => postContent(content, apiMedia)