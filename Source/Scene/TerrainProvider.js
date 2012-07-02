/*global define*/
define([
        '../Core/DeveloperError',
        '../Core/ComponentDatatype',
        '../Renderer/BufferUsage',
        '../Core/IndexDatatype'
    ], function(
        DeveloperError,
        ComponentDatatype,
        BufferUsage,
        IndexDatatype) {
    "use strict";

    /**
     * Provides terrain or other geometry for the surface of an ellipsoid.  The surface geometry is
     * organized into a pyramid of tiles according to a {@link TilingScheme}.  This type describes an
     * interface and is not intended to be instantiated directly.
     *
     * @alias TerrainProvider
     * @constructor
     *
     * @see EllipsoidTerrainProvider
     */
    function TerrainProvider() {
        /**
         * The tiling scheme used to tile the surface.
         *
         * @type TilingScheme
         */
        this.tilingScheme = undefined;

        throw new DeveloperError('This type should not be instantiated directly.');
    }

    /**
     * Specifies the indices of the attributes of the terrain geometry.
     *
     * @memberof TerrainProvider
     */
    TerrainProvider.attributeIndices = {
            position3D : 0,
            textureCoordinates : 1,
            position2D : 2
        };

    TerrainProvider.createTileGeometryFromBuffers = function(context, tile, buffers) {
        var datatype = ComponentDatatype.FLOAT;
        var typedArray = datatype.toTypedArray(buffers.vertices);
        var buffer = context.createVertexBuffer(typedArray, BufferUsage.STATIC_DRAW);
        var stride = 5 * datatype.sizeInBytes;
        var attributes = [{
            index : TerrainProvider.attributeIndices.position3D,
            vertexBuffer : buffer,
            componentDatatype : datatype,
            componentsPerAttribute : 3,
            offsetInBytes : 0,
            strideInBytes : stride
        }, {
            index : TerrainProvider.attributeIndices.textureCoordinates,
            vertexBuffer : buffer,
            componentDatatype : datatype,
            componentsPerAttribute : 2,
            offsetInBytes : 3 * datatype.sizeInBytes,
            strideInBytes : stride
        }, {
            index : TerrainProvider.attributeIndices.position2D,
            value : [0.0, 0.0]
        }];
        var indexBuffer = context.createIndexBuffer(new Uint16Array(buffers.indices), BufferUsage.STATIC_DRAW, IndexDatatype.UNSIGNED_SHORT);

        tile._extentVA = context.createVertexArray(attributes, indexBuffer);
    };

    /**
     * Populates a {@link Tile} with surface geometry from this tile provider.
     *
     * @memberof TerrainProvider
     *
     * @param {Tile} tile The tile to populate with surface geometry.
     * @returns {Promise} TODO: what are we promising?  Some sort of indication of success?
     */
    TerrainProvider.prototype.createTileGeometry = function(tile) {
        // Is there a limit on 'level' of the tile that can be passed in?  It seems
        // natural to have a maxLevel, but this would cause problems if we have hi-res imagery
        // and low-res terrain.  So I'd say we can continue to refine terrain tiles arbitrarily
        // until both the terrain and all the imagery layers have no more detail to give.  In that
        // case, this method is expected to be able to produce geometry for an arbitrarily-deep
        // tile tree.
        throw new DeveloperError('This type should not be instantiated directly.');
    };

    return TerrainProvider;
});