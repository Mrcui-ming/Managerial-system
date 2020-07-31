import { LOGINSUC,LOGINERR,EXITLOGIN} from "../action/action_type";

const initState = {
  username: "",
  password: "",
  msg: ""
}

const loginReducer = ((state = initState,action) => {
  switch(action.type){
    case LOGINSUC:
      return state = action.payload;
    case LOGINERR:
      return {
        ...initState,
        msg: action.payload
      }
    case EXITLOGIN:
      return initState
    default: 
      return state
  }
})

export default loginReducer;