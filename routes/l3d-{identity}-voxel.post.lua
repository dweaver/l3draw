--#ENDPOINT POST /l3d/{identity}/voxel
print('writing to voxel: ' .. request.body.voxel)
return L3d.setIdentityState({
  context_id=Product.id, 
  identity=request.parameters.identity,
  voxel=request.body.voxel
})
