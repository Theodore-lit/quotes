import { useLoginStore } from '@/stores/login';
const loginStore = useLoginStore()
import { jwtDecode } from 'jwt-decode'
let decoded;
const token = loginStore.token
if (token) {
  decoded = jwtDecode(token)
}
export default decoded