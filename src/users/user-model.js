function makeUser ({ validator }) {
    return ({ 
        email, password, name, bio, subscription, isAdmin, isBestSeller, strategiesOwned, strategiesPublished 
    }) => {
        const user = validator({ email, password, name, bio, subscription, isAdmin, isBestSeller, strategiesOwned, strategiesPublished });

        return user;
    }
}

module.exports = makeUser;