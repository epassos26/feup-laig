//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}

serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'primitives/Rectangle.js', 'primitives/Triangle.js',
	'primitives/BaselessCylinder.js', 'primitives/Circle.js', 'primitives/Cylinder.js', 'primitives/Sphere.js',
	'primitives/Torus.js', 'Component.js', 'Utils.js', 'Transformation.js', 'Texture.js',
	'Interface.js', 'animations/Animation.js', 'animations/LinearAnimation.js','animations/CircularAnimation.js',
    'ListNode.js', 'primitives/Plane.js', 'primitives/Patch.js', 'primitives/Vehicle.js', 'primitives/Chessboard.js',
    'primitives/Prism.js', 'primitives/Tile.js', 'primitives/tile_decorations/Wormhole.js', 'primitives/UnitCube.js',
    'PrologInterface.js','board/Board.js', 'board/Hex.js', 'board/Game.js', 'board/Piece.js', 'board/AuxBoard.js',
    'primitives/buildings/SSEColony.js', 'primitives/buildings/SSETradeStation.js', 'board/Play.js',
    'animations/LinearPieceAnimation.js',


main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myScene = new XMLscene();
    var myInterface = new Interface(myScene);

    myScene.interface = myInterface;

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor)

	var filename=getUrlVars()['file'] || "LAIG_TP3_DSX_T2_G06_v01.dsx";

	// create and load graph, and associate it to scene.
	// Check console for loading errors
	var myGraph = new MySceneGraph(filename, myScene);

	// start
    app.run();
}

]);
