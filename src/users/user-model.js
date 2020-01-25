function makeUser ({ validator }) {
    return ({ 
        email, 
        password, 
        name, 
        bio, 
        subscription, 
        isAdmin, 
        isBestSeller, 
        strategiesOwned, 
        strategiesPublished 
    }) => {
        const user = validator({ email, password, name, bio, subscription, isAdmin, isBestSeller, strategiesOwned, strategiesPublished });
        if (!user) throw Error('User is not valid');

        return user;
    }
}

module.exports = makeUser;