//Bloom Settings
//BLOOM_THRESHOLD - how bright a pixel needs to be to become blurred
//BLOOM_INTENSITY - how bright the bloom effect is
//LENS_DIRT - draws lens dirt on the screen
//DIRT_INTENSITY - how intense the dirt effect is
//BLOOM_ONLY - only shows the blur created by bloom
#define BLOOM_THRESHOLD 0.5
#define BLOOM_INTENSITY 3.0
#define DIRT_INTENSITY 5.0
//#define BLOOM_ONLY

//Blur Settings
//BLUR_ITERATIONS - how many times a blur is created
//BLUR_SIZE - the radius of the bloom
//BLUR_SUBDIVISIONS - how many times the texture is sampled per iteration
#define BLUR_ITERATIONS 5.0
#define BLUR_SIZE .03
#define BLUR_SUBDIVISIONS 48.0

vec3 getHDR(vec3 tex) {
    return max((tex - BLOOM_THRESHOLD) * BLOOM_INTENSITY, 0.);
    
}

vec3 gaussian(sampler2D sampler, vec2 uv) {
    vec3 sum = vec3(0.);
    
    for(float i = 1.0; i <= BLUR_ITERATIONS; i++) {
     
        float angle = 360. / float(BLUR_SUBDIVISIONS);
        
        for(float j = 0.0; j < BLUR_SUBDIVISIONS; j++) {
         
            float dist = BLUR_SIZE * (float(i+1.0) / float(BLUR_ITERATIONS));
            float s    = sin(angle * float(j));
            float c       = cos(angle * float(j));
            
            sum += getHDR(texture2D(sampler, uv + vec2(c,s)*dist).xyz);
            
        }
        
    }
    
    sum /= float(BLUR_ITERATIONS * BLUR_SUBDIVISIONS);
    return sum * BLOOM_INTENSITY;
    
}

vec3 blend(vec3 a, vec3 b) {
 
    return 1. - (1. - a)*(1. - b);
    
}

void main()
{
    vec2 uv = openfl_TextureCoordv;
    vec4 tx = texture2D(bitmap, uv);
    
    gl_FragColor.rgb = gaussian(bitmap, uv) * (1. - float(tx.rgb));
    gl_FragColor.a   = tx.a;
    gl_FragColor.rgb = blend(tx.rgb, gl_FragColor.rgb);
}
