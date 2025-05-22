plugins {
	java
	id("org.springframework.boot") version "3.4.5"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "kal.com"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(24)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.session:spring-session-core")

	//mapstruct with lombok
	implementation( "org.mapstruct:mapstruct:1.5.5.Final" )

	annotationProcessor(  "org.mapstruct:mapstruct-processor:1.5.5.Final" )
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	annotationProcessor(  "org.projectlombok:lombok-mapstruct-binding:0.2.0" )

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	implementation("com.mysql:mysql-connector-j:9.1.0") // Replace with the latest stable version
	//jwt
	implementation(  "io.jsonwebtoken:jjwt-api:0.11.5" )
	runtimeOnly(  "io.jsonwebtoken:jjwt-impl:0.11.5" )
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")// o jjwt-gson si prefieres Gson
}

tasks.withType<Test> {
	useJUnitPlatform()
}
