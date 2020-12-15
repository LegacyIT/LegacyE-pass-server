/**
 *handles catching errors in an async function.
 * @param {function} fn
 */
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
