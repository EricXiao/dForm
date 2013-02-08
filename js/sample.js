function viewSourceCode()
{
	window.location = "view-source:" + window.location.href;
}


function initCodeSamples()
{
	var $source = $("#sourceCode");
	$("#codeExample").click(
		function(){
			if($(this).html()=="View source code") {
				$source.show("fast");
				if( !this.old ){
					this.old = $(this).html();
					$.get(this.href, function(code){
						// Remove <!-- Start_Exclude [...] End_Exclude --> blocks:
						code = code.replace(/<!-- Start_Exclude(.|\n|\r)*?End_Exclude -->/gi, "<!-- (Irrelevant source removed.) -->");
						// Reduce tabs from 8 to 2 characters
						code = code.replace(/\t/g, "  ");
						$source.text(code);
						// Format code samples
					}, "html");
				}
				$(this).html("Hide source code");
			} else {
				$source.hide("fast");
				$(this).html("View source code");
			}
		}
	);
}

$(function(){
	initCodeSamples();
});
