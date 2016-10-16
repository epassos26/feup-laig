function Texture(scene, file, length_s, length_t) {
    this.texture = new CGFtexture(scene, "assets/" + file);
    this.length_s = length_s;
    this.length_t = length_t;
}

Texture.prototype.constructor = Texture;

/**
 * Applies this texture to the given appearance.
 */
Texture.prototype.apply = function(appearance) {
    appearance.setTexture(this.texture);
//    appearance.setTextureWrap(this.length_s, this.length_t);
}
