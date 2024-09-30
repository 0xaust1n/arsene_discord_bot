module.exports = {
  name: 'number',
  description: 'utility for function number',
  numberParse: (input, userLevege) => {
    try {
      if (input == 'a' || input == 'all') {
        return userLevege.toString();
      }

      if (input == 'h' || input == 'half') {
        return Math.floor(userLevege / 2).toString();
      }

      // Remove any commas and spaces, and convert to lowercase
      const cleanInput = input.replace(/[, ]/g, '').toLowerCase();

      // Regular expression to match numbers with optional suffixes
      const regex = /(-?\d+(?:\.\d+)?[hkmbtq]?)/g;

      const matches = cleanInput.match(regex);

      if (!matches) {
        throw new Error('Invalid input format');
      }

      const units = {
        h: 100,
        k: 1000,
        m: 1000000,
        b: 1000000000,
        t: 1000000000000,
        q: 1000000000000000,
      };

      let total = 0;

      for (let match of matches) {
        const numRegex = /(-?\d+(?:\.\d+)?)/;
        const suffixRegex = /[hkmbtq]$/;

        const number = parseFloat(match.match(numRegex)[0]);
        const suffix = match.match(suffixRegex);

        if (suffix && suffix[0] in units) {
          total += number * units[suffix[0]];
        } else {
          total += number;
        }
      }

      return total.toString();
    } catch {
      return NaN;
    }
  },
};
