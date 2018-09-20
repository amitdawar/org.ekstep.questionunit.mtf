/**
 *
 * Question Unit plugin to render a MTF question
 * @class org.ekstep.questionunit.mtf
 * @extends org.ekstep.contentrenderer.questionUnitPlugin
 * @author Manoj Chandrashekar <manoj.chandrashekar@tarento.com>
 */
org.ekstep.questionunitmtf = {};
org.ekstep.questionunitmtf.RendererPlugin = org.ekstep.contentrenderer.questionUnitPlugin.extend({
  _type: 'org.ekstep.questionunit.mtf',
  _isContainer: true,
  _render: true,
  _selectedAnswers: [],
  _dragulaContainers: [],
  _drake: undefined,
  _constant: {
    horizontal: "Horizontal",
    vertial: "Vertical"
  },
  setQuestionTemplate: function () {
    MTFController.initTemplate(this); // eslint-disable-line no-undef
  },

  preQuestionShow: function (event) {
    this._super(event);
    var inst = this;

    // If the any of the lhs or rhs had a image then the layout is vertical
    _.each(this._question.data.option.optionsLHS, function (lhs) {
      if (lhs.image) {
        inst._question.config.layout = "Vertical";
      }
    })
    _.each(this._question.data.option.optionsRHS, function (rhs) {
      if (rhs.image) {
        inst._question.config.layout = "Vertical";
      }
    })
    this._question.template = MTFController.getQuestionTemplate(this._question.config.layout, this._constant);
    //shuffle rhs answers
    this._question.data.option.optionsRHS = _.shuffle(this._question.data.option.optionsRHS);
  },
  postQuestionShow: function (event) {
    var instance = this;
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESS); // eslint-disable-line no-undef
  },
  evaluateQuestion: function (event) {
    var instance = this;
    var callback = event.target;
    var correctAnswer = true;
    var correctAnswersCount = 0;
    var telemetryValues = [];
    var totalLHS = instance._question.data.option.optionsLHS.length;
    instance._selectedRHS = [];
    $('.rhs-block').each(function (expectedOptionMapIndex, elem) {
      var telObj = {
        'LHS': [],
        'RHS': []
      };
      var selectedOptionMapIndex = parseInt($(elem).data('mapindex')) - 1;
      telObj['LHS'][expectedOptionMapIndex] = instance._question.data.option.optionsLHS[expectedOptionMapIndex];
      telObj['RHS'][selectedOptionMapIndex] = instance._question.data.option.optionsRHS[selectedOptionMapIndex];
      telemetryValues.push(telObj);
      instance._selectedRHS.push(instance._question.data.option.optionsRHS[selectedOptionMapIndex]);
      if (selectedOptionMapIndex == expectedOptionMapIndex) {
        correctAnswersCount++;
      } else {
        correctAnswer = false;
      }
    })
    var questionScore;
    if (this._question.config.partial_scoring) {
      questionScore = (correctAnswersCount / totalLHS) * this._question.config.max_score;
    } else {
      if ((correctAnswersCount / totalLHS) == 1) {
        questionScore = this._question.config.max_score;
      } else {
        questionScore = 0
      }
    }

    var result = {
      eval: correctAnswer,
      state: {
        val: {
          "lhs": this._question.data.option.optionsRHS,
          "rhs": instance._selectedRHS
        }
      },
      score: questionScore,
      values: telemetryValues,
      noOfCorrectAns: correctAnswersCount,
      totalAns: totalLHS
    };
    if (_.isFunction(callback)) {
      callback(result);
    }
    EkstepRendererAPI.dispatchEvent('org.ekstep.questionset:saveQuestionState', result.state);
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.ASSESSEND, result); // eslint-disable-line no-undef
  },
  logTelemetryItemResponse: function (data) {
    QSTelemetryLogger.logEvent(QSTelemetryLogger.EVENT_TYPES.RESPONSE, {
      "type": "INPUT",
      "values": data
    });
  }
});
//# sourceURL=questionunitMTFPlugin.js