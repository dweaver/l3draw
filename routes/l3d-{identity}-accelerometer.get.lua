--#ENDPOINT GET /l3d/{identity}/accelerometer
local response = L3d.getIdentityState({
  context_id=Product.id, 
  identity=request.parameters.identity,
})
 
-- response looks like  
-- {"voxel":{"set":"1,1,1,255,255,255","timestamp":1.493916536434e+15}}
 
if response.accelerometer == nil then
  return {}
else
  return response.accelerometer
end
