import API from './webapi.services';
import config from '../config';
import axios from "axios";

const usersUrl = config.usersApiUrl;

export const register = async (param) => {
  try{
    return await API.post(`${usersUrl}`, param).then(
      response => {
        return response.data;
      },
      error =>{
        console.log(error);
        return  null;
      }
    );
  }catch(error){
    console.log(error);
    return null;
  }
}

export const login = async (param) => {
  try{
  //   return await API.post(`${usersUrl}/login`, param).then(
  //     response => {
  //       return response.data;
  //     },
  //     error =>{
  //       console.log(error);
  //       return  null;
  //     }
  //   );


    const response = await axios.get(`${usersUrl}`);

    const matchingUsers = response.data.filter(user =>
        user.email === param.email && user.password === param.password
    );

    if (matchingUsers.length > 0) {
      const matchedUser = matchingUsers[0];
      return {
        name: matchedUser.name,
        id: matchedUser.id,
        hourValue: matchedUser.hourValue,
        email: matchedUser.email,
        password: matchedUser.password,

      };
    } else {
      return null;
    }

  }catch(error){
    console.log(error);
    return null;
  }
}
