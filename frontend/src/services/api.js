export async function apiFetch(url, options = {}){

  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`,{
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  })

  if(res.status === 401){
    
  }
    
  return res.json()
}

