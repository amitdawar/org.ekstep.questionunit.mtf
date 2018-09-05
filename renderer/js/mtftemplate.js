var MTFController = MTFController || {};

MTFController.constant = {
  qsMTFElement: ".mtf-container"
};

/**
 * enables accessing plugin instance inside MTFController
 * @memberof org.ekstep.questionunit.mtf.mtftemplate
 */
MTFController.initTemplate = function (pluginInstance) {
  MTFController.pluginInstance = pluginInstance;
};


MTFController.getQuestionTemplate = function (selectedLayout, availableLayout) {

  MTFController.selectedLayout = selectedLayout;
  var wrapperStart = '<div onload="MTFController.onDomReady()" class="mtf-container plugin-content-container">\
                        <div class="mtf-content-container <%= MTFController.selectedLayout %>">';
  var wrapperStartQuestionComponent = '<div class="mtf-header">';
  var wrapperEndQuestionComponent = '</div>';
  var wrapperStartOptionComponent = '<div class="mtf-options-container-margin" ></div>\
  <div class="mtf-options-container">'
  var wrapperEnd =        '</div></div>\
                      </div><script>MTFController.onDomReady()</script>';
  var getLayout;
  if (availableLayout.horizontal == selectedLayout) {
    getLayout = MTFController.getHorizontalLayout;
  } else {
    getLayout = MTFController.getVerticalLayout;
  }

  return org.ekstep.questionunit.backgroundComponent.getBackgroundGraphics() + wrapperStart  + wrapperStartQuestionComponent + org.ekstep.questionunit.questionComponent.generateQuestionComponent() + wrapperEndQuestionComponent + wrapperStartOptionComponent + getLayout() + wrapperEnd;
}


MTFController.getHorizontalLayout = function(){
  return '\
  <div class="mtf-options-horizontal-container">\
    <div class="lhs-rhs-container lhs-container">\
        <% _.each(question.data.option.optionsLHS,function(val,key){ %>\
            <div class="lhs-block lhs-rhs-block">\
              <img class="background-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/shape3.png") %>" />\
              <% if(val.audio){ %> \
                <img onclick=MTFController.pluginInstance.playAudio({src:"<%= val.audio %>"}) class="audio-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/audio2.png") %>" />\
              <% } %>\
              <span class="option-text"><%= val.text %></span>\
            </div>\
        <% });%>\
    </div>\
    <div class="lhs-rhs-container rhs-container">\
        <% _.each(question.data.option.optionsRHS,function(val,key){ %>\
            <div data-mapindex=<%= val.mapIndex %> class="rhs-block lhs-rhs-block">\
                <img class="background-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/shape4.png") %>" />\
                <% if(val.audio){ %> \
                  <img onclick=MTFController.pluginInstance.playAudio({src:"<%= val.audio %>"}) class="audio-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/audio2.png") %>" />\
                <% } %>\
                <span class="option-text"><%= val.text %></span>\
            </div>\
        <% });%>\
    </div>\
</div>';
}


MTFController.getVerticalLayout = function () {
  return '\
  <div class="mtf-options-vertical-container options-<%= question.data.option.optionsLHS.length %>">\
    <div class="lhs-rhs-container lhs-container">\
      <% _.each(question.data.option.optionsLHS,function(val,key){ %>\
        <div class="lhs-rhs-block lhs-block">\
            <img class="background-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/shape1.png") %>" />\
            <span><%= val.text %></span>\
            <img onclick="org.ekstep.questionunit.baseComponent.showImageModel(event, \'<%= val.image %>\')" class="option-image" src="<%= val.image %>" />\
            <% if(val.audio){ %> \
              <img onclick=MTFController.pluginInstance.playAudio({src:"<%= val.audio %>"}) class="audio-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/audio3.png") %>" />\
            <% } %>\
        </div>\
      <% }); %>\
    </div>\
    <div class="lhs-rhs-container rhs-container">\
      <% _.each(question.data.option.optionsRHS,function(val,key){ %>\
        <div data-mapindex=<%= val.mapIndex %> class="lhs-rhs-block rhs-block">\
        <img class="background-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/shape2.png") %>" />\
        <span><%= val.text %></span>\
        <img onclick="org.ekstep.questionunit.baseComponent.showImageModel(event, \'<%= val.image %>\')" class="option-image" src="<%= val.image %>" />\
        <% if(val.audio){ %> \
          <img onclick=MTFController.pluginInstance.playAudio({src:"<%= val.audio %>"}) class="audio-image" src="<%= MTFController.pluginInstance.getAudioIcon("renderer/assets/audio3.png") %>" />\
        <% } %>\
        </div>\
      <% }); %>\
      </div>\
  </div>'
}
            
MTFController.onDomReady = function(){
    $(document).ready(function(){
        $(".rhs-container").sortable();
        $(".rhs-container").disableSelection();
    }) 
}

//# sourceURL=MTFController.js
