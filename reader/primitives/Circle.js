/**
 * Circle
 * @constructor
 */
function Circle(scene, slices, radius) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.radius = radius;

    this.initBuffers();
};

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.initBuffers = function() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var ang = (2 * Math.PI) / this.slices;
    var xCoord = 0;
    var yCoord = 0;
    console.log(this.radius);

    for (i = 0; i < this.slices; i++) {
        this.vertices.push(Math.cos(ang * i)*this.radius, Math.sin(ang * i)*this.radius, 0);
        this.vertices.push(Math.cos(ang * (i + 1))*this.radius, Math.sin(ang * (i + 1))*this.radius, 0);
        this.vertices.push(0, 0, 0);

        this.indices.push(this.vertices.length / 3 - 3, this.vertices.length / 3 - 2, this.vertices.length / 3 - 1);
        this.normals.push(0, 0, 1,
            0, 0, 1,
            0, 0, 1);

        this.texCoords.push(0.5 + Math.cos(ang * i) / 2, 0.5 - Math.sin(ang * i) / 2);
        this.texCoords.push(0.5 + Math.cos(ang * (i + 1)) / 2, 0.5 - Math.sin(ang * (i + 1)) / 2);
        this.texCoords.push(0.5, 0.5);
    }

    this.vertices.push(Math.cos(ang), Math.sin(ang));

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
