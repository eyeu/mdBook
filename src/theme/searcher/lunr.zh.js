(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    /**
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    factory()(root.lunr);
  }
}(this, function () {
  return function (lunr) {
    if ('undefined' === typeof lunr) {
      throw new Error('Lunr is not present. Please include / require Lunr before this script.');
    }

    /* register specific locale function */
    lunr.zh = function () {
      this.pipeline.reset();
      this.pipeline.add(
        lunr.zh.trimmer,
        lunr.zh.stopWordFilter,
        lunr.zh.stemmer
      );

      // for lunr version 2
      // this is necessary so that every searched word is also stemmed before
      // in lunr <= 1 this is not needed, as it is done using the normal pipeline
      if (this.searchPipeline) {
        this.searchPipeline.reset();
        this.searchPipeline.add(lunr.zh.stemmer)
      }
    };

    lunr.zh.tokenizer = function (str) {
      if (!arguments.length || str === null || str === undefined) return [];
      if (Array.isArray(str)) {
        var arr = str.filter(function (token) {
          if (token === null || token === undefined) {
            return false;
          }

          return true;
        });

        arr = arr.map(function (t) {
          return lunr.utils.toString(t);
        });

        var out = [];
        arr.forEach(function (item) {
          var tokens = item.split(lunr.tokenizer.seperator);
          out = out.concat(tokens);
        }, this);

        return out;
      }

      return str.toString().trim().split(lunr.tokenizer.seperator);
    };


    /* lunr trimmer function */
    lunr.zh.trimmer = function (_token) {
      return _token;
    }

    lunr.Pipeline.registerFunction(lunr.zh.trimmer, 'trimmer-zh');

    /* lunr stemmer function */
    lunr.zh.stemmer = (function () {
      /* and return a function that stems a word for the current locale */
      return function (token) {
        return token;
      }
    })();
    lunr.Pipeline.registerFunction(lunr.zh.stemmer, 'stemmer-zh');
    lunr.generateStopWordFilter = function (stopWords) {
      var words = stopWords.reduce(function (memo, stopWord) {
        memo[stopWord] = stopWord
        return memo
      }, {})
      return function (token) {
        if (token && words[token.toString()] !== token.toString()) return token
      }
    }

    lunr.zh.stopWordFilter = lunr.generateStopWordFilter(
      '的 一 不 在 人 有 是 为 以 于 上 他 而 后 之 来 及 了 因 下 可 到 由 这 与 也 此 但 并 个 其 已 无 小 我 们 起 最 再 今 去 好 只 又 或 很 亦 某 把 那 你 乃 它 吧 被 比 别 趁 当 从 到 得 打 凡 儿 尔 该 各 给 跟 和 何 还 即 几 既 看 据 距 靠 啦 了 另 么 每 们 嘛 拿 哪 那 您 凭 且 却 让 仍 啥 如 若 使 谁 虽 随 同 所 她 哇 嗡 往 哪 些 向 沿 哟 用 于 咱 则 怎 曾 至 致 着 诸 自'.split(' '));
    lunr.Pipeline.registerFunction(lunr.zh.stopWordFilter, 'stopWordFilter-zh');
  };
}))