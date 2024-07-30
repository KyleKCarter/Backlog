require('dotenv').config();
const axios = require('axios');

const {
    API_CLIENT_ID,
    API_ACCESS_TOKEN,
    API_TOKEN_TYPE
} = process.env

let get_games = async(req, res) => {
    const { name } = req.params;
    // await axios.post(`https://api.igdb.com/v4/games/?search=${name}`, 
    //     {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Client-ID': `${API_CLIENT_ID}`,
    //             'Authorization': `Bearer ${API_ACCESS_TOKEN}`
    //         },
    //         body: "fields artworks.*,cover.*,genres.*,name,age_ratings.*,age_ratings.content_descriptions.*,first_release_date,parent_game.name,platforms.*,aggregated_rating,rating,storyline,summary,websites.*,videos.*,involved_companies.company.name,involved_companies.company.logo;"
    //     }
    // )
    //     .then((games => {
    //         res.status(200).json(games.data)
    //     })
    // ).catch((error => {
    //     console.log(error)
    // }))
    axios({
        // url: `https://api.igdb.com/v4/games/?search=${name}`,
        url: `https://api.igdb.com/v4/games/?search=${name}&fields=artworks.*,cover.*,genres.*,name,age_ratings.*,age_ratings.content_descriptions.*,first_release_date,parent_game.name,platforms.*,aggregated_rating,rating,storyline,summary,websites.*,videos.*,involved_companies.company.name,involved_companies.company.logo;`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': `${API_CLIENT_ID}`,
            'Authorization': `${API_TOKEN_TYPE} ${API_ACCESS_TOKEN}`
        },
        // body: "&fields=artworks.*,cover.*,genres.*,name,age_ratings.*,age_ratings.content_descriptions.*,first_release_date,parent_game.name,platforms.*,aggregated_rating,rating,storyline,summary,websites.*,videos.*,involved_companies.company.name,involved_companies.company.logo;"
        })
        .then(response => {
            res.status(200).json(response.data)
        })
        .catch(error => {
            console.log(error)
        })
}

module.exports = {
    get_games
}