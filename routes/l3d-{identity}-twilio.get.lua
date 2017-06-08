--#ENDPOINT GET /l3d/{identity}/twilio
print('SMS from Twilio: ' .. request.parameters.Body)

-- split Body into alphanumeric phrases
colors = {}
body = request.parameters.Body
for color in body:gmatch("%w+") do 
  table.insert(colors, color) 
end

print('colors: ' .. to_json(colors))
numColors = table.getn(colors)
if numColors == 0 or table[1] == "help" then
  return "Need at least one alphanumeric color. Try 'red white'"
end

-- initialize table
voxtable = {}
colorIndex = 1
for n=1,512 do
  color = '0'
  item = string.lower(colors[colorIndex])
  if item == '0' or item == 'black' then 
    color = '0'
  elseif item == '1' or item == 'red' then 
    color = '1'
  elseif item == '2' or item == 'green' then 
    color = '2'
  elseif item == '3' or item == 'blue' then 
    color = '3'
  elseif item == '4' or item == 'yellow' then 
    color = '4'
  elseif item == '5' or item == 'cyan' or item == 'lightblue' then 
    color = '5'
  elseif item == '6' or item == 'magenta' or item == 'purple' then 
    color = '6'
  elseif item == '7' or item == 'gray' or item == 'grey' then 
    color = '7'
  elseif item == '8' or item == 'orange' then 
    color = '8'
  elseif item == '9' or item == 'exoblue' then 
    color = '9'
  elseif item == 'a' or item == 'exonavy' then 
    color = 'a'
  elseif item == 'b' or item == 'exogray' or item == 'exogrey' then 
    color = 'b'
  else 
    color = '0'
  end

  voxtable[n] = color 
  -- does the following look wrong? Lua 
  -- starts arrays at 1
  colorIndex = (colorIndex % numColors) + 1
end

voxels = table.concat(voxtable, "")
print('writing voxels from Twilio: ' .. voxels)

response = L3d.setIdentityState({
  context_id=Product.id,
  identity=request.parameters.identity,
  voxels=voxels
})

if response.status_code == 204 then
  return "Set some LEDs!"
else
  return "Something went wrong. " .. to_json(response)
end
