const fetchDataforPoint = async () =>{
    const response = await fetch('');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
}

export const PointApi = {
    getPoint: async (id: number) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}points?id=${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        return result;
        
      } catch (error) {
        console.log(error);
      }
    },
    addPoint: async (id: number, data : object) => {
        console.log(JSON.stringify(data));
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}points?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
          
        } catch (error) {
          console.log(error);
        }
      }
}
