--#ENDPOINT POST /l3d/{identity}/voxels
print('writing to voxels: ' .. to_json(request.body.voxels))

-- voxels look like this:
-- {voxels={{x=0,y=0,z=0,color=0}}}

-- initialize table
voxtable = {}
for n=1,512 do
  voxtable[n] = 0
end

-- for each voxel, set the appropriate location in the table
for _,voxel in ipairs(request.body.voxels) do
  voxtable[1 + voxel.z + voxel.y * 8 + voxel.x * 64] = voxel.color
end

voxels = table.concat(voxtable, "")
print('writing voxels: ' .. voxels)

return L3d.setIdentityState({
  context_id=Product.id,
  identity=request.parameters.identity,
  voxels=voxels
})
