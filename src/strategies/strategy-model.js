function makeStrategy ({ validator }) {
    return ({ 
        name,
        description,
        author,
        categories,
        tradeFrequency,
        price,
        profitable
    }) => {
        const strategy = validator({ name, description, author, categories, tradeFrequency, price, profitable });
        if (!strategy) throw Error('Strategy is not valid');

        return strategy;
    }
}

module.exports = makeStrategy;