const { createClient } = require("@supabase/supabase-js");

const get_prompt = async function () {

    const supabase = createClient(process.env.URL, process.env.KEY);

    try {

        let { data, error} = await supabase
        .from('prompt')
        .select('v')
        .eq('string', 'prompt_ai_prescricao');
        
        return data[0].v;

    } catch (error) {
        
        console.error('Erro ao processar:', error.message);
        throw error;
        
    }

};

module.exports = { get_prompt };