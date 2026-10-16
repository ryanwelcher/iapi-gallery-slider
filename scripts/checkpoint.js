/**
 * Presenter helper: put this plugin into a section's finished state for a
 * checkpoint demo, or back to the starter.
 *
 *   npm run checkpoint 5      build code-reference/section-5 and use its plugin file
 *   npm run checkpoint reset  back to the starter (src/ and the committed plugin file)
 *
 * src/ is never touched: the snapshot is built straight into build/, which is
 * what WordPress loads. Only iapi-gallery-slider.php is swapped, and `reset`
 * restores it from git. Don't run `npm run start` at the same time, or the
 * watcher rebuilds build/ from src/ and the checkpoint disappears.
 */
const { execSync } = require( 'child_process' );
const fs = require( 'fs' );
const path = require( 'path' );

const root = path.resolve( __dirname, '..' );
const PLUGIN_FILE = 'iapi-gallery-slider.php';
const MARKER = path.join( root, '.checkpoint' );
const run = ( cmd ) => execSync( cmd, { cwd: root, stdio: 'inherit' } );

const sections = fs
	.readdirSync( path.join( root, 'code-reference' ) )
	.map( ( dir ) => dir.match( /^section-(\d+)$/ ) )
	.filter( Boolean )
	.map( ( match ) => match[ 1 ] );

const arg = process.argv[ 2 ];
if ( ! arg || ( arg !== 'reset' && ! sections.includes( arg ) ) ) {
	console.error(
		`Usage: npm run checkpoint <${ sections.join( '|' ) }|reset>`
	);
	process.exit( 1 );
}

// Refuse to overwrite real edits to the plugin file. A previous checkpoint's
// copy is fine to replace, since the marker says we put it there.
const pluginFileChanged =
	execSync( `git status --porcelain -- ${ PLUGIN_FILE }`, { cwd: root } )
		.toString()
		.trim() !== '';
if ( pluginFileChanged && ! fs.existsSync( MARKER ) ) {
	console.error(
		`${ PLUGIN_FILE } has uncommitted changes that didn't come from a checkpoint. Commit or stash them first.`
	);
	process.exit( 1 );
}

if ( arg === 'reset' ) {
	run( `git checkout HEAD -- ${ PLUGIN_FILE }` );
	run( 'npx wp-scripts build --experimental-modules' );
	fs.rmSync( MARKER, { force: true } );
	console.log( '\nBack to the starter. Reload the site.' );
} else {
	const snapshot = path.join( 'code-reference', `section-${ arg }` );
	fs.copyFileSync(
		path.join( root, snapshot, PLUGIN_FILE ),
		path.join( root, PLUGIN_FILE )
	);
	run(
		`npx wp-scripts build --experimental-modules --webpack-src-dir=${ snapshot }/src`
	);
	fs.writeFileSync( MARKER, arg + '\n' );
	console.log( `\nCheckpoint ${ arg } is live. Reload the site.` );
}
