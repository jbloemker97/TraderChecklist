function makeStrategy ({ validator }) {
    return ({ 
        name,
        description,
        author,
        categories,
        tradeFrequency,
        price,
        performance
    }) => {
        const strategy = validator({ name, description, author, categories, tradeFrequency, price, performance });
        if (!strategy) throw Error('Strategy is not valid');

        return strategy;
    }
}

module.exports = makeStrategy;