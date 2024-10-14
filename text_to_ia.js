const text_to_ia = async function (prompt) {

    let success = false;

    let responseObject = [];

    while (!success) {
        try {
/*             const response = await fetch('https://open-pumped-lacewing.ngrok-free.app/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama3.2",
                    prompt: `${prompt}`,
                    stream: false,
                    temperature: 0.1
                }) 
            });       */   

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' + process.env.OPENAI_KEY,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: `${prompt}`
                        }
                    ],
                    temperature: 0.7
                }) 
            });      

            r = await response;
           
            if(r.status == 200){
               
                const IAServerResponse = await r.json();

                const open_ai_response = IAServerResponse.choices[0].message.content;         
              
                // Extract the array of objects from the response text
                const matches = open_ai_response.match(/\[.*?\]/s);      
 
                if (matches && matches.length > 0) {
                    responseObject = JSON.parse(matches[0]);
                    
                    // Check if each object in the array has 'medicamento' and 'dosagem' keys
                    responseObject.forEach(obj => {
                        if (!obj.hasOwnProperty('medicamento') || !obj.hasOwnProperty('posologia')) {
                            throw new Error("Objeto no array não possui as chaves 'medicamento' e 'dosagem'.");
                        }
                    });

                    console.log("IA JSON no formato correto, objeto verificado.");
                } else {
                    throw new Error("Array de objetos não encontrado no texto da resposta.");
                }

            } else {
                console.error('Offline');
            }                   

            success = true;

        } catch (error) {
            
            console.error("IA não conseguiu gerar JSON corretamente: ", error.message);
            console.error(error.message)

        }
    }   

    return responseObject;
};

module.exports = { text_to_ia };
